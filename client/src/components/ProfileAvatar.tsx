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
    <div>
      {/* always render the <img> with avatarUrl */}
      <img
        src={avatarUrl}
        alt={profile?.fullName || 'User avatar'}
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
      {/* then name/role beneath */}
      <div>{profile?.fullName}</div>
      <small>Role: {profile?.role}</small>
    </div>
  );
};