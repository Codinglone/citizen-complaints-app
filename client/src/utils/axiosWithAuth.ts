import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: '/api'
});

// Log HTTP requests (helpful for debugging)
axiosWithAuth.interceptors.request.use(
  config => {
    // Get the token from localStorage or wherever you store it
    const token = localStorage.getItem('auth_token');
    
    console.log('Request URL:', config.url);
    console.log('Auth Token Present:', !!token);
    
    if (token) {
      // Set the authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Log HTTP responses
axiosWithAuth.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    return response;
  },
  error => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle token expiration or authentication issues
    if (error.response?.status === 401) {
      console.log('Authentication error - redirecting to login');
      // You may want to redirect to login page or refresh token here
    }
    
    return Promise.reject(error);
  }
);

export default axiosWithAuth;