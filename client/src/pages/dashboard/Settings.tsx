import React from 'react';
import { useTranslation } from 'react-i18next';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('userDashboard.settings')}</h1>
      
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Account Settings</h2>
          
          <div className="form-control flex flex-col w-full max-w-md">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="email" value="user@example.com" className="input input-bordered" readOnly />
          </div>
          
          <div className="form-control flex flex-col w-full max-w-md mt-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input type="text" defaultValue="John Doe" className="input input-bordered" />
          </div>
          
          <div className="form-control flex flex-col w-full max-w-md mt-4">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input type="tel" defaultValue="+1 234 567 8900" className="input input-bordered" />
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Notification Preferences</h2>
          
          <div className="flex items-center justify-between mb-3">
            <span>Email Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span>Status Update Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span>Comments Notifications</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Save Preferences</button>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Security</h2>
          
          <button className="btn btn-outline mb-3 w-full max-w-md">Change Password</button>
          <button className="btn btn-outline mb-3 w-full max-w-md">Enable Two-Factor Authentication</button>
          
          <div className="border-t border-base-300 my-6"></div>
          
          <h3 className="font-semibold text-error mb-3">Danger Zone</h3>
          <button className="btn btn-outline btn-error w-full max-w-md">Delete Account</button>
        </div>
      </div>
    </div>
  );
};