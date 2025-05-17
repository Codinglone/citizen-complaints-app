import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import { ProfileAvatar } from './components/ProfileAvatar';
import { LandingPage } from './pages/LandingPage';
import { AdminPanel } from './pages/AdminPanel';
import { AdminLogin } from './pages/AdminLogin';
import { UserDashboard } from './pages/UserDashboard';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { SubmitComplaintForm } from './pages/SubmitComplaintForm';
import './i18n';

// Add a simple callback component
const AuthCallback = () => {
  const { handleRedirectCallback } = useAuth();
  React.useEffect(() => {
    handleRedirectCallback();
  }, [handleRedirectCallback]);
  
  return <div>Loading...</div>;
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${theme}`}>
        {/* Only show public navbar on non-dashboard routes */}
        <Routes>
          <Route path="/dashboard/*" element={null} />
          <Route path="/admin/*" element={null} />
          <Route path="*" element={
            <nav className="bg-base-200 p-4">
              <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                  {t('app.title')}
                </Link>
                <div className="flex gap-4 items-center">
                  <button onClick={toggleLanguage} className="btn btn-ghost btn-circle">
                    {i18n.language === 'en' ? 'FR' : 'EN'}
                  </button>
                  <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  {isAuthenticated ? (
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                          <ProfileAvatar profile={profile} />
                        </div>
                      </label>
                      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                        <li><Link to="/dashboard">{t('nav.dashboard')}</Link></li>
                        <li><a onClick={logout}>{t('nav.signout')}</a></li>
                      </ul>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={login} className="btn btn-primary">
                        {t('nav.signin')}
                      </button>
                      <Link to="/admin/login" className="btn btn-outline">
                        {t('nav.adminSignin')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          } />
        </Routes>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/submit-complaint-form" element={<SubmitComplaintForm />} />
          <Route path="/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
