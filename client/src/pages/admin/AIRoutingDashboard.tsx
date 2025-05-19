import React, { useState, useEffect } from 'react';
import { useApi } from '../../utils/api';

interface ComplaintData {
  title: string;
  description: string;
  location: string;
  categoryId: string;
}

export const AIRoutingDashboard: React.FC = () => {
  const { fetchWithAuth } = useApi();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<ComplaintData>({
    title: '',
    description: '',
    location: '',
    categoryId: ''
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Flag to prevent additional calls during unmount
    let isMounted = true;
    
    // Fetch categories only once
    const fetchCategories = async () => {
      try {
        // Add a flag to prevent retries on failure
        if (categories.length > 0) return;
        
        const response = await fetchWithAuth('/categories', { requireAuth: true });
        if (!isMounted) return; // Prevent state updates after unmount
        
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          if (data.length > 0) {
            setFormData(prev => ({...prev, categoryId: data[0].id}));
          }
        } else {
          console.error('Failed to fetch categories:', response.status);
          // Don't retry on error - just set empty categories
          setCategories([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };
    
    fetchCategories();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Remove fetchWithAuth from dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const testAIRouting = async () => {
    setIsAnalyzing(true);
    setAiResult(null);
    
    try {
      // Add timeout to prevent hanging UI
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      // Test the AI routing
      const response = await fetchWithAuth('/admin/test-ai-routing', {
        method: 'POST',
        body: JSON.stringify(formData),
        requireAuth: true,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setAiResult(data);
      } else {
        let errorMessage = 'Failed to test AI routing';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
        }
        console.error(errorMessage);
        
        // Show error in the result area
        setAiResult({
          error: errorMessage,
          suggestedCategory: 'Error',
          suggestedCategoryId: null,
          suggestedAgency: 'Error',
          suggestedAgencyId: null,
          confidence: 0,
          sentimentScore: 0,
          language: 'en'
        });
      }
    } catch (error) {
      console.error('Error testing AI routing:', error);
      
      // Show error in the result area
      setAiResult({
        error: error instanceof Error ? error.message : 'Request failed or timed out',
        suggestedCategory: 'Error',
        suggestedCategoryId: null,
        suggestedAgency: 'Error',
        suggestedAgencyId: null,
        confidence: 0,
        sentimentScore: 0,
        language: 'en'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">AI Routing Test Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Test the AI complaint categorization and agency routing system.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Test Complaint</h3>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Complaint Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter complaint title"
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered"
                rows={5}
                placeholder="Enter complaint description"
              ></textarea>
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Enter location"
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Selected Category</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={testAIRouting}
              className={`btn btn-primary ${isAnalyzing ? 'loading' : ''}`}
              disabled={isAnalyzing || !formData.title || !formData.description}
            >
              {isAnalyzing ? 'Analyzing...' : 'Test AI Routing'}
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Analysis Results</h3>
            
            {aiResult ? (
              <div className="bg-base-200 p-4 rounded-lg">
                {aiResult.error && (
                  <div className="mb-4 text-error">
                    <h4 className="font-medium">Error</h4>
                    <div className="mt-2 p-2 bg-error bg-opacity-10 rounded">
                      {aiResult.error}
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="font-medium">Suggested Category</h4>
                  <div className="flex items-center mt-2">
                    <div className="badge badge-primary mr-2">
                      {aiResult.suggestedCategory || 'None'}
                    </div>
                    <span className="text-sm">
                      ({aiResult.suggestedCategoryId || 'N/A'})
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Suggested Agency</h4>
                  <div className="flex items-center mt-2">
                    <div className="badge badge-secondary mr-2">
                      {aiResult.suggestedAgency || (aiResult.suggestedAgencyId ? 'Unnamed Agency' : 'None')}
                    </div>
                    <span className="text-sm">
                      ({aiResult.suggestedAgencyId || 'N/A'})
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Confidence Score</h4>
                  <div className="flex items-center mt-2">
                    <progress 
                      className="progress progress-primary w-56" 
                      value={aiResult.confidence} 
                      max="100"
                    ></progress>
                    <span className="ml-2">{aiResult.confidence}%</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Sentiment Analysis</h4>
                  <div className="flex items-center mt-2">
                    <progress 
                      className={`progress w-56 ${
                        aiResult.sentimentScore > 0 ? 'progress-success' : 
                        aiResult.sentimentScore < 0 ? 'progress-error' : 'progress-warning'
                      }`}
                      value={Math.abs(aiResult.sentimentScore)} 
                      max="100"
                    ></progress>
                    <span className="ml-2">{aiResult.sentimentScore}</span>
                  </div>
                  <div className="text-sm mt-1">
                    {aiResult.sentimentScore > 30 ? 'Positive' : 
                     aiResult.sentimentScore < -30 ? 'Negative' : 'Neutral'} sentiment
                  </div>
                </div>
                
                <div className="mb-2">
                  <h4 className="font-medium">Detected Language</h4>
                  <div className="mt-1">
                    <div className="badge">{aiResult.language}</div>
                  </div>
                </div>
                
                {aiResult && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Debug Information</span>
                      <button 
                        className="btn btn-xs btn-outline" 
                        onClick={() => setShowDebug(!showDebug)}
                      >
                        {showDebug ? 'Hide Raw Data' : 'Show Raw Data'}
                      </button>
                    </div>
                    
                    {showDebug && (
                      <div className="mt-2 p-2 bg-base-300 rounded overflow-auto max-h-60">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(aiResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-base-200 p-4 rounded-lg text-center">
                <p className="text-gray-500">
                  {isAnalyzing 
                    ? 'Analyzing complaint...' 
                    : 'Enter complaint details and click "Test AI Routing" to see results'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};