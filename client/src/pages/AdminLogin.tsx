import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from '../utils/api'; // Changed from '../hooks/useApi'

export const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Save token and user data in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        // Better error handling
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
        setError(t('adminLogin.genericError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('adminLogin.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <div className="max-w-md w-full bg-base-200 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('adminLogin.title')}</h1>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">{t('adminLogin.emailLabel')}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">{t('adminLogin.passwordLabel')}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <button
            type="submit"
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? t('adminLogin.loggingIn') : t('adminLogin.loginButton')}
          </button>
        </form>
        
        <div className="divider mt-6">{t('adminLogin.orDivider')}</div>
        
        <p className="text-center">
          <button 
            className="btn btn-link"
            onClick={() => navigate('/')}
          >
            {t('adminLogin.backToHome')}
          </button>
        </p>
      </div>
    </div>
  );
};