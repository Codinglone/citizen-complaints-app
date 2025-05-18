import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApi } from '../utils/api';

interface ComplaintStatus {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: {
    name: string;
  };
  agency?: {
    name: string;
  };
  location: string;
  createdAt: string;
  updatedAt: string;
  trackingCode: string;
}

export const TrackComplaint: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { fetchWithAuth } = useApi();
  const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
  const [complaint, setComplaint] = useState<ComplaintStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Automatically search if code is in URL
  useEffect(() => {
    if (searchParams.get('code')) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const response = await fetchWithAuth(`/complaints/track/${trackingCode}`, {
        requireAuth: false
      });
      
      if (response.ok) {
        const data = await response.json();
        setComplaint(data);
      } else {
        if (response.status === 404) {
          setError('No complaint found with that tracking code');
        } else {
          setError('An error occurred while tracking your complaint');
        }
        setComplaint(null);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <div className="badge badge-neutral">Pending</div>;
      case 'assigned':
        return <div className="badge badge-info">Assigned</div>;
      case 'in-progress':
      case 'in progress':
        return <div className="badge badge-warning">In Progress</div>;
      case 'resolved':
        return <div className="badge badge-success">Resolved</div>;
      default:
        return <div className="badge">{status}</div>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-4xl mx-auto my-8">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{t('tracking.title', 'Track Your Complaint')}</h2>
        <p className="text-gray-600 mb-6">
          {t('tracking.description', 'Enter the tracking code you received when submitting your complaint.')}
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Enter tracking code"
            className="input input-bordered flex-grow"
          />
          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`} 
            onClick={handleSearch}
            disabled={loading}
          >
            Track
          </button>
        </div>
        
        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        {searched && complaint && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Complaint Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p><span className="font-bold">Tracking Code:</span> {complaint.trackingCode}</p>
                <p><span className="font-bold">Title:</span> {complaint.title}</p>
                <p><span className="font-bold">Category:</span> {complaint.category?.name}</p>
                <p><span className="font-bold">Location:</span> {complaint.location}</p>
              </div>
              <div>
                <p><span className="font-bold">Status:</span> {getStatusBadge(complaint.status)}</p>
                <p><span className="font-bold">Priority:</span> {complaint.priority}</p>
                <p><span className="font-bold">Submitted:</span> {formatDate(complaint.createdAt)}</p>
                <p><span className="font-bold">Last Updated:</span> {formatDate(complaint.updatedAt)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold mb-2">Description</h4>
              <div className="bg-base-200 p-4 rounded-lg">
                {complaint.description}
              </div>
            </div>
            
            {complaint.agency && (
              <div className="mb-6">
                <h4 className="font-bold mb-2">Assigned To</h4>
                <div className="bg-base-200 p-4 rounded-lg">
                  {complaint.agency.name}
                </div>
              </div>
            )}
            
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>
                Keep your tracking code safe. You'll need it to check the status of your complaint in the future.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};