import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SubmitComplaint: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        alert(t('submitComplaint.success'));
        setTitle('');
        setDescription('');
      } else {
        alert(t('submitComplaint.error'));
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert(t('submitComplaint.error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <h1 className="text-4xl font-bold mb-4">{t('submitComplaint.title')}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('submitComplaint.titleLabel')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('submitComplaint.descriptionLabel')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          {t('submitComplaint.submit')}
        </button>
      </form>
    </div>
  );
}; 