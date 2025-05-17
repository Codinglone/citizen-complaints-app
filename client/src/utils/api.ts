import { useAuth } from '../hooks/useAuth';

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

    const response = await fetch(url, {
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