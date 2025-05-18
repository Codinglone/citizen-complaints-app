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
    <div className="avatar inline-flex items-center">
      {/* perfectly circular container */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={avatarUrl}
          alt={profile?.fullName || 'User avatar'}
          className="object-cover w-full h-full"
        />
      </div>
      {showDetails && (
        <div className="ml-2">
          <div>{profile?.fullName}</div>
          <small>Role: {profile?.role}</small>
        </div>
      )}
    </div>
  );
};