import React from 'react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

interface ProfileAvatarProps {
  profile: Profile | null;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const defaultAvatar = 'https://avatar.iran.liara.run/public/31';
  const avatarUrl = profile?.profileImage || defaultAvatar;

  return (
    <div className="flex items-center space-x-2">
      <img src={avatarUrl} alt={profile?.fullName || 'User'} className="w-10 h-10 rounded-full" />
      <span>{profile?.fullName || 'Guest'}</span>
    </div>
  );
}; 