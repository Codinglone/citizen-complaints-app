import React from 'react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

interface ProfileAvatarProps {
  profile: Profile | null;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  // Use a default avatar if no profile or no profileImage
  const defaultAvatar = 'https://avatar.iran.liara.run/public/31';
  const avatarUrl = profile?.profileImage || defaultAvatar;
  
  // For debugging
  console.log("Profile in Avatar:", profile);
  console.log("Avatar URL:", avatarUrl);

  return (
    <img 
      src={avatarUrl} 
      alt={profile?.fullName || 'User'} 
      className="w-full h-full rounded-full object-cover"
    />
  );
};