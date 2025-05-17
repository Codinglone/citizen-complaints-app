import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const SubmitComplaintForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    attachments: null as FileList | null
  });

  const categories = [
    { value: 'roads', label: t('complaint.categories.roads') },
    { value: 'water', label: t('complaint.categories.water') },
    { value: 'waste', label: t('complaint.categories.waste') },
    { value: 'electricity', label: t('complaint.categories.electricity') },
    { value: 'publicTransport', label: t('complaint.categories.publicTransport') },
    { value: 'noise', label: t('complaint.categories.noise') },
    { value: 'other', label: t('complaint.categories.other') }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, attachments: e.target.files }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success handling
      setSuccess(true);
      // Reset form
      setFormData({
        category: '',
        description: '',
        location: '',
        attachments: null
      });
      
      // Redirect to complaints list after successful submission
      setTimeout(() => {
        navigate('/dashboard/complaints');
      }, 2000);
      
    } catch (err) {
      setError(t('complaint.error'));
      console.error('Error submitting complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('complaint.title')}</h1>
      
      {success && (
        <div className="alert alert-success mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{t('complaint.success')}</span>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('complaint.category')}</span>
          </label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>{t('complaint.categoryPlaceholder')}</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-control flex flex-col">
          <label className="label">
            <br />
            <span className="label-text">{t('complaint.description')}</span>
          </label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            className="textarea textarea-bordered h-32"
            placeholder={t('complaint.descriptionPlaceholder')}
            required
          ></textarea>
        </div>
        
        <div className="form-control flex flex-col">
          <label className="label">
            <span className="label-text">{t('complaint.location')}</span>
          </label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            className="input input-bordered" 
            placeholder={t('complaint.locationPlaceholder')}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('complaint.attachments')}</span>
          </label>
          <input 
            type="file" 
            className="file-input file-input-bordered w-full" 
            onChange={handleFileChange}
            multiple
          />
          <label className="label">
            <span className="label-text-alt">{t('complaint.attachmentsDescription')}</span>
          </label>
        </div>
        
        <div className="form-control mt-8">
          <button 
            type="submit" 
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : t('complaint.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};