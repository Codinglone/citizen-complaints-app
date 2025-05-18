import React, { useEffect, useState } from 'react';
import { useApi } from '../utils/api';
import config from '../config';

export const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection to:', config.apiUrl);
        
        // First, try without authentication
        const response = await fetch(`${config.apiUrl}/health`);
        
        if (response.ok) {
          setStatus('API connection successful without auth');
          
          // Now try with authentication
          const authResponse = await fetchWithAuth('/auth/verify', { 
            requireAuth: true 
          });
          
          if (authResponse.ok) {
            setStatus('API connection and authentication successful');
          } else {
            setStatus(`API connected but authentication failed: ${authResponse.status}`);
          }
        } else {
          setStatus(`API connection failed: ${response.status}`);
        }
      } catch (err) {
        console.error('API test error:', err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Configuration:</h2>
        <p><strong>API URL:</strong> {config.apiUrl}</p>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Connection Status:</h2>
        <p>{status}</p>
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};