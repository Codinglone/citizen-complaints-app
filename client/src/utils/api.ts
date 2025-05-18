import config from '../config';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  const fetchWithAuth = async (url: string, options: RequestOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options;
    
    let headers = { ...fetchOptions.headers } as Record<string, string>;
    
    // Add authentication token if required
    if (requireAuth) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('Adding auth token to request');
      } else {
        console.log('No token available for authenticated request');
      }
    }

    // Add content type if needed
    if (
      fetchOptions.method && 
      ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method) && 
      !headers['Content-Type'] && 
      !(fetchOptions.body instanceof FormData)
    ) {
      headers['Content-Type'] = 'application/json';
    }

    // Construct the full URL with the API base URL
    const fullUrl = url.startsWith('http') ? url : `${config.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log('Making API request to:', fullUrl);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers
    });

    return response;
  };

  return { fetchWithAuth };
};