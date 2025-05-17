import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const SignIn: React.FC = () => {
  const { t } = useTranslation();
//   const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert(t('signIn.success'));
      } else {
        alert(t('signIn.error'));
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert(t('signIn.error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <h1 className="text-4xl font-bold mb-4">{t('signIn.title')}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('signIn.emailLabel')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('signIn.passwordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          {t('signIn.submit')}
        </button>
      </form>
    </div>
  );
}; 