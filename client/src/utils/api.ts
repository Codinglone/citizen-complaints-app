import { useAuth } from '../hooks/useAuth';
import config from '../config';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  const { getToken, isAuthenticated } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options;
    
    let headers = { ...fetchOptions.headers } as Record<string, string>;
    
    // Add authentication token if required and user is authenticated
    if (requireAuth && isAuthenticated) {
      const token = await getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add content type if not already set and method implies body
    if (
      fetchOptions.method && 
      ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method) && 
      !headers['Content-Type'] && 
      !(fetchOptions.body instanceof FormData)
    ) {
      headers['Content-Type'] = 'application/json';
    }

    // Construct the full URL - combine the API base URL with the endpoint
    // If the URL already starts with http or https, use it as is
    const fullUrl = url.startsWith('http') ? url : `${config.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log('Making API request to:', fullUrl);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Handle unauthorized - could redirect to login
      console.error('Authentication error');
    }

    return response;
  };

  return { fetchWithAuth };
};