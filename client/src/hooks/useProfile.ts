import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage: string; // make required
  role: string;
}

export function useProfile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState<Profile | null>(null);

  // wherever you’d like, define your default:
  const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public/31';

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }
    let mounted = true;

    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        });

        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          const newProfile: Profile = {
            ...data,
            // FALLBACK CHAIN:
            profileImage:
              data.profileImage ?? user?.picture ?? DEFAULT_AVATAR,
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            role: data.role
          };
          setProfile(prev =>
            JSON.stringify(prev) !== JSON.stringify(newProfile)
              ? newProfile
              : prev
          );
        } else {
          // fallback entirely to Auth0 + default avatar
          setProfile({
            id: user?.sub || '',
            fullName: user?.name || '',
            email: user?.email || '',
            profileImage: user?.picture ?? DEFAULT_AVATAR,
            role: 'citizen'
          });
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching profile:', err);
        setProfile({
          id: user?.sub || '',
          fullName: user?.name || '',
          email: user?.email || '',
          profileImage: user?.picture ?? DEFAULT_AVATAR,
          role: 'citizen'
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]); // only re-run when auth state changes

  return { profile };
}