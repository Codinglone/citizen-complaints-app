import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';
import { ProfileAvatar } from '../../components/ProfileAvatar';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: ''
  });
  
  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: (profile as any).phoneNumber ?? '',
        city:  ''
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to API
    console.log('Form submitted:', formData);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('userDashboard.settings')}</h1>
      
      {/* Profile Card */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">{t('userDashboard.profileInformation')}</h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <ProfileAvatar profile={profile} />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold">{profile?.fullName}</h3>
              <p className="text-sm opacity-70">{profile?.email}</p>
              <div className="badge badge-primary mt-2">
                {profile?.role || t('role.citizen')}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('userDashboard.fullName')}</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input input-bordered" 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('userDashboard.email')}</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  readOnly
                  className="input input-bordered opacity-70" 
                />
                <label className="label">
                  <span className="label-text-alt">{t('userDashboard.emailCannotChange')}</span>
                </label>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('userDashboard.phoneNumber')}</span>
                </label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input input-bordered" 
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('userDashboard.city')}</span>
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input input-bordered" 
                />
              </div>
            </div>
            
            <div className="card-actions justify-end mt-6">
              <button type="submit" className="btn btn-primary">
                {t('userDashboard.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Notification Preferences */}
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">{t('userDashboard.notificationPreferences')}</h2>
          
          <div className="flex items-center justify-between mb-3">
            <span>{t('userDashboard.emailNotifications')}</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span>{t('userDashboard.statusUpdateNotifications')}</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span>{t('userDashboard.commentsNotifications')}</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">{t('userDashboard.savePreferences')}</button>
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">{t('userDashboard.security')}</h2>
          
          <button className="btn btn-outline mb-3 w-full max-w-md">{t('userDashboard.changePassword')}</button>
          <button className="btn btn-outline mb-3 w-full max-w-md">{t('userDashboard.enableTwoFactor')}</button>
          
          <div className="border-t border-base-300 my-6"></div>
          
          <h3 className="font-semibold text-error mb-3">{t('userDashboard.dangerZone')}</h3>
          <button className="btn btn-outline btn-error w-full max-w-md">{t('userDashboard.deleteAccount')}</button>
        </div>
      </div>
    </div>
  );
};