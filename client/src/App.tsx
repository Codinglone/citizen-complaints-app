import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import { ProfileAvatar } from './components/ProfileAvatar';
import { LandingPage } from './pages/LandingPage';
import { AdminPanel } from './pages/AdminPanel';
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
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="btn btn-secondary">
                        {t('nav.dashboard')}
                      </Link>
                      <Link to="/dashboard/submit" className="btn btn-primary">
                        {t('nav.submitComplaint')}
                      </Link>
                      <Link to="/admin" className="btn btn-accent">
                        {t('nav.adminPanel')}
                      </Link>
                      <ProfileAvatar profile={profile} />
                      <button onClick={() => logout()} className="btn btn-ghost">
                        {t('nav.signOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => login()} className="btn btn-primary">
                        {t('nav.signIn')}
                      </button>
                      <button onClick={toggleLanguage} className="btn btn-ghost">
                        {i18n.language === 'en' ? 'Français' : 'English'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </nav>
          } />
        </Routes>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/submit-complaint-form" element={<SubmitComplaintForm />} />
          
          {/* Add callback route */}
          <Route path="/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
