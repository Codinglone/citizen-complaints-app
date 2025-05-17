import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, phoneNumber }),
      });
      if (response.ok) {
        alert(t('register.success'));
      } else {
        alert(t('register.error'));
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert(t('register.error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <h1 className="text-4xl font-bold mb-4">{t('register.title')}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('register.fullNameLabel')}</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('register.emailLabel')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('register.passwordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('register.phoneNumberLabel')}</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          {t('register.submit')}
        </button>
      </form>
    </div>
  );
}; 