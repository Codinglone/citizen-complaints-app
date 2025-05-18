import React, { useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useTheme } from '../hooks/useTheme';
import { useProfile } from '../hooks/useProfile';
import { ProfileAvatar } from './ProfileAvatar';
import type { Profile } from '../hooks/useProfile';

interface DashboardLayoutProps {
  isAdmin: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { logoutAdmin, adminUser } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Default avatar for users/admins without one
  const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public/31';
  
  // Determine which links to show based on whether this is the admin or user dashboard
  const navLinks = isAdmin
    ? [
        { to: '/admin', label: t('nav.dashboard'), icon: '🏠' },
        { to: '/admin/complaints', label: t('nav.complaints'), icon: '📝' },
        { to: '/admin/users', label: t('nav.users'), icon: '👥' },
        { to: '/admin/analytics', label: t('nav.analytics'), icon: '📊' },
        { to: '/admin/settings', label: t('nav.settings'), icon: '⚙️' },
      ]
    : [
        { to: '/dashboard', label: t('nav.dashboard'), icon: '🏠' },
        { to: '/dashboard/complaints', label: t('nav.myComplaints'), icon: '📝' },
        { to: '/dashboard/submit', label: t('nav.submitComplaint'), icon: '✍️' },
        { to: '/dashboard/settings', label: t('nav.settings'), icon: '⚙️' },
      ];

  const handleLogout = () => {
    // Use appropriate logout method based on whether we're in admin or user dashboard
    if (isAdmin) {
      logoutAdmin();
    } else {
      logout();
      navigate('/');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  // pick adminUser or profile
  const displayUser = isAdmin ? adminUser : profile;
  
  // map to Profile, ensuring profileImage is always a string
  const completeUser: Profile | null = displayUser
    ? {
        id: displayUser.id,
        fullName: displayUser.fullName,
        email: displayUser.email,
        role: displayUser.role,
        // if no image in DB, use default
        profileImage: displayUser.profileImage ?? DEFAULT_AVATAR
      }
    : null;

  return (
    <div className={`drawer lg:drawer-open ${theme}`}>
      <input 
        id="drawer-toggle" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />
      
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <div className="navbar bg-base-200 sticky top-0 z-10 shadow-md">
          <div className="flex-none">
            <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost drawer-button lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl">{isAdmin ? t('adminPanel.title') : t('userDashboard.title')}</span>
          </div>
          <div className="flex-none">
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={toggleLanguage} className="btn btn-ghost btn-circle">
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </button>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {/* Use completeUser only when available */}
                  {completeUser && (
                    <ProfileAvatar
                      profile={completeUser}
                      showDetails
                    />
                  )}
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                <li><a onClick={() => navigate(isAdmin ? '/admin/profile' : '/dashboard/profile')}>{t('nav.profile')}</a></li>
                <li><a onClick={() => navigate(isAdmin ? '/admin/settings' : '/dashboard/settings')}>{t('nav.settings')}</a></li>
                <li><a onClick={handleLogout}>{t('nav.signout')}</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 bg-base-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Drawer/Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <aside className="w-80 bg-base-200 min-h-full pb-4">
          <div className="px-4 py-6 flex flex-col h-full">
            {/* App Title */}
            <div className="flex items-center p-2 mb-6">
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"} 
                className="text-xl font-bold flex-1"
                onClick={() => setDrawerOpen(false)}
              >
                {t('app.title')}
              </Link>
            </div>
            
            {/* Navigation Links */}
            <ul className="menu menu-lg p-2 w-full">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className={window.location.pathname === link.to ? "active" : ""}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Spacer */}
            <div className="flex-1"></div>
            
            {/* User Info */}
            <div className="p-4 bg-base-300 rounded-lg">
              <div className="flex items-center">
                <div className="avatar mr-3">
                  <div className="w-10 rounded-full">
                    {/* Use completeUser only when available */}
                    {completeUser && (
                      <ProfileAvatar
                        profile={completeUser}
                        showDetails
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-bold">{displayUser?.fullName}</div>
                  <div className="text-sm opacity-75">{displayUser?.role}</div>
                </div>
              </div>
              <div className="mt-3">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-sm btn-outline btn-block"
                >
                  {t('nav.signout')}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};