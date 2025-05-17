import { useState, useEffect } from 'react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  return { profile };
}; 