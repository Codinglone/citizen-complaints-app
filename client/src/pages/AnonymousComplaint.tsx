import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../utils/api';

export const AnonymousComplaint: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<{id: string, trackingCode: string} | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [error, setError] = useState('');
  
  // Fetch categories when component mounts
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth('/categories', { requireAuth: false });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [fetchWithAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetchWithAuth('/complaints/anonymous', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          location: formData.location,
          contactEmail: formData.contactEmail || undefined,
          contactPhone: formData.contactPhone || undefined
        }),
        requireAuth: false
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setTrackingInfo({
          id: data.id,
          trackingCode: data.trackingCode
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          categoryId: '',
          location: '',
          contactName: '',
          contactEmail: '',
          contactPhone: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error submitting complaint:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-4xl mx-auto my-8">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{t('complaint.anonymousTitle', 'Submit Anonymous Complaint')}</h2>
        <p className="text-gray-600 mb-6">{t('complaint.anonymousDescription', 'Use this form to submit a complaint without creating an account. You will receive a tracking code to check your complaint status.')}</p>
        
        {success && trackingInfo && (
          <div className="alert alert-success mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <h3 className="font-bold">Complaint Submitted Successfully!</h3>
              <p>Your tracking code is: <span className="font-bold">{trackingInfo.trackingCode}</span></p>
              <p>Please save this code to check your complaint status later.</p>
              <button 
                className="btn btn-sm btn-primary mt-2"
                onClick={() => navigate(`/track-complaint?code=${trackingInfo.trackingCode}`)}
              >
                Track Your Complaint
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('complaint.title')}</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a brief title for your complaint"
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('complaint.category')}</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>{t('complaint.categoryPlaceholder', 'Select a category')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('complaint.location')}</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter the location related to the complaint"
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('complaint.description')}</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the issue"
                className="textarea textarea-bordered h-32"
                required
              />
            </div>
            
            <div className="divider">Contact Information (Optional)</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('complaint.contactName')}</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('complaint.contactEmail')}</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('complaint.contactPhone')}</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : t('complaint.submit', 'Submit Complaint')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};