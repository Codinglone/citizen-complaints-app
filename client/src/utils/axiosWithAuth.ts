import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: '/api'
});

// Log HTTP requests (helpful for debugging)
axiosWithAuth.interceptors.request.use(
  (config: import('axios').AxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    console.log('Request URL:', config.url);
    console.log('Auth Token Present:', !!token);
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: import('axios').AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosWithAuth.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    return response;
  },
  (error: import('axios').AxiosError) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('Authentication error - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;