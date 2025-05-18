import React from 'react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role: string;
}

interface ProfileAvatarProps {
  profile: Profile | null;
  showDetails?: boolean;    // ← new optional flag
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  showDetails = false,      // default to hiding text
 }) => {
   const defaultAvatar = 'https://avatar.iran.liara.run/public/31';
   const avatarUrl = profile?.profileImage || defaultAvatar;

   return (
     <div>
   <img
     src={avatarUrl}
     alt={profile?.fullName || 'User avatar'}
     style={{ width: 40, height: 40, borderRadius: '50%' }}
   />
  {showDetails && (
    <>
      <div>{profile?.fullName}</div>
      <small>Role: {profile?.role}</small>
    </>
  )}
 </div>
   );
 };