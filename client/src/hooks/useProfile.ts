import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { isAuthenticated, user, getToken } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) {
        setProfile(null);
        return;
      }

      try {
        // First, try to get detailed profile from our backend
        const token = await getToken();
        
        if (!token) {
          // If token acquisition fails, use basic Auth0 profile
          setProfile({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.picture,
            role: user.role
          });
          console.log("Using Auth0 profile (no token):", {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.picture
          });
          return;
        }
        
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          console.log("API profile data:", profileData);
          setProfile({
            ...profileData,
            profileImage: profileData.profileImage || user.picture
          });
        } else {
          // If backend fetch fails, fallback to basic Auth0 profile
          console.log("API fetch failed, using fallback profile");
          setProfile({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.picture || 'https://avatar.iran.liara.run/public/31',
            role: user.role
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        
        // Use basic Auth0 profile as fallback
        if (user) {
          setProfile({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.picture || 'https://avatar.iran.liara.run/public/31',
            role: user.role
          });
        } else {
          setProfile(null);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, getToken]);

  return { profile };
};