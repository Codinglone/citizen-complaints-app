import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { AdminPanel } from './pages/AdminPanel';
import { UserDashboard } from './pages/UserDashboard';
import { ProfileAvatar } from './components/ProfileAvatar';
import './i18n';

// Create protected route wrapper
type ProtectedRouteProps = {
  children: React.ReactNode;
  isAuthenticated: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  // const { isAuthenticated, user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Placeholder for authentication state
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

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
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="btn btn-ghost">
                        {t('nav.signIn')}
                      </Link>
                      <Link to="/register" className="btn btn-ghost">
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                  <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  <button onClick={toggleLanguage} className="btn btn-ghost btn-circle">
                    {i18n.language === 'en' ? '🇫🇷' : '🇺🇸'}
                  </button>
                </div>
              </div>
            </nav>
          } />
        </Routes>

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          {/* Redirect /submit-complaint to the dashboard */}
          <Route path="/submit-complaint" element={
            isAuthenticated ? 
            <Navigate to="/dashboard/submit" /> : 
            <Navigate to="/signin" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
