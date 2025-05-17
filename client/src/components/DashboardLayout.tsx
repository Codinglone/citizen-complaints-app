import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useProfile } from '../hooks/useProfile';
import { ProfileAvatar } from './ProfileAvatar';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

type ThemeName = 
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'retro'
  | 'cyberpunk'
  | 'garden';

interface DashboardLayoutProps {
  isAdmin?: boolean;
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin = false }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { profile } = useProfile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Theme options from DaisyUI
  const themeOptions = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 
    'corporate', 'synthwave', 'retro', 'cyberpunk', 'garden'
  ];

  // Define navigation links based on role
  const navLinks = isAdmin 
    ? [
        { to: '/admin', label: t('nav.adminDashboard'), icon: '📊' },
        { to: '/admin/complaints', label: t('nav.manageComplaints'), icon: '📝' },
        { to: '/admin/users', label: t('nav.manageUsers'), icon: '👥' },
        { to: '/admin/analytics', label: t('nav.analytics'), icon: '📈' },
      ]
    : [
        { to: '/dashboard', label: t('nav.userDashboard'), icon: '🏠' },
        { to: '/dashboard/complaints', label: t('nav.myComplaints'), icon: '📋' },
        { to: '/dashboard/submit', label: t('nav.submitComplaint'), icon: '✍️' },
        { to: '/dashboard/settings', label: t('nav.settings'), icon: '⚙️' },
      ];

  const handleLogout = () => {
    // Logout logic
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold px-2">
              {isAdmin ? t('adminPanel.title') : t('userDashboard.title')}
            </h1>
          </div>
          <div className="flex-none gap-2">
            <button onClick={toggleLanguage} className="btn btn-ghost btn-circle">
              {i18n.language === 'en' ? '🇫🇷' : '🇺🇸'}
            </button>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <ProfileAvatar profile={profile} />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                <li><a onClick={() => navigate(isAdmin ? '/admin/profile' : '/dashboard/profile')}>{t('nav.profile')}</a></li>
                <li><a onClick={() => navigate(isAdmin ? '/admin/settings' : '/dashboard/settings')}>{t('nav.settings')}</a></li>
                <li><a onClick={handleLogout}>{t('nav.logout')}</a></li>
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
        <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-base-200 w-64 min-h-screen p-4 flex flex-col">
          {/* Branding */}
          <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-base-300">
            <div className="font-bold text-xl">
              {isAdmin ? '🏛️ Admin Portal' : '🏙️ Citizen Portal'}
            </div>
          </div>
          
          {/* Navigation Links */}
          <ul className="menu menu-md">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={location.pathname === link.to ? 'active' : ''}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto">
            {/* Theme Switcher */}
            <div className="dropdown dropdown-top w-full">
              <label tabIndex={0} className="btn btn-outline btn-block mb-2">
                <span className="mr-2">🎨</span>
                {t('theme.change')}
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 max-h-60 overflow-y-auto">
                {themeOptions.map(themeOption => (
                  <li key={themeOption}>
                    <a 
                      onClick={() => setTheme(themeOption as ThemeName)}
                      className={theme === themeOption ? 'active' : ''}
                    >
                      {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Language switcher */}
            <button 
              className="btn btn-outline btn-block mb-2"
              onClick={toggleLanguage}
            >
              <span className="mr-2">{i18n.language === 'en' ? '🇫🇷' : '🇺🇸'}</span>
              {i18n.language === 'en' ? 'Français' : 'English'}
            </button>
            
            {/* Back button */}
            <button 
              className="btn btn-ghost btn-block"
              onClick={() => navigate('/')}
            >
              <span className="mr-2">🏠</span>
              {t('nav.backToHome')}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};