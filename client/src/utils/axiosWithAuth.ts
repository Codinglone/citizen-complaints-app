import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: '/api',
  withCredentials: true      // <— send cookies/auth headers
});

// Log HTTP requests
axiosWithAuth.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Log HTTP responses
axiosWithAuth.interceptors.response.use(
  response => response,
  (error: any) => Promise.reject(error)
);

export default axiosWithAuth;