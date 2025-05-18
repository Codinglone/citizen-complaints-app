import React, { useState } from 'react';
import { useApi } from '../utils/api';

export const TestComplaintFlow: React.FC = () => {
  const { fetchWithAuth } = useApi();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testComplaintCreation = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetchWithAuth('/complaints/anonymous', {
        method: 'POST',
        body: JSON.stringify({
          title: `Test Complaint ${new Date().toISOString()}`,
          description: 'This is a test complaint generated automatically',
          categoryId: '149c6629-31b1-449c-87e3-b9157694dce5',
          location: 'Test Location',
          contactEmail: 'test@example.com',
          contactPhone: "39963175+019"
        }),
        requireAuth: false
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create complaint: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const trackingCode = data.trackingCode;
      
      setResult(`
        Complaint created successfully!
        ID: ${data.id}
        Tracking Code: ${trackingCode}
        
        Testing complaint tracking...
      `);
      
      // 2. Track the created complaint
      const trackResponse = await fetchWithAuth(`/complaints/track/${trackingCode}`, {
        requireAuth: false
      });
      
      if (!trackResponse.ok) {
        throw new Error(`Failed to track complaint: ${trackResponse.status} ${trackResponse.statusText}`);
      }
      
      const trackData = await trackResponse.json();
      
      setResult(prev => `
        ${prev}
        
        Tracking successful!
        Title: ${trackData.title}
        Status: ${trackData.status}
        Category: ${trackData.category?.name}
        
        Full flow test completed successfully!
      `);
      
    } catch (error) {
      setResult(`Error during test: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-3xl mx-auto my-8">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">Test Complaint Flow</h2>
        <p className="mb-4">This page allows you to quickly test the complaint submission and tracking functionality.</p>
        
        <button 
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          onClick={testComplaintCreation}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Run Test'}
        </button>
        
        {result && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Test Results:</h3>
            <pre className="bg-base-200 p-4 rounded-lg whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};