import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

const axiosWithAuth = axios.create({
  baseURL: '/api'
});

// Log HTTP requests (helpful for debugging)
axiosWithAuth.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    
    console.log('Request URL:', config.url);
    console.log('Auth Token Present:', !!token);
    
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosWithAuth.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('Authentication error - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;