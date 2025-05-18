import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: '/api'
});

// Log HTTP requests
axiosWithAuth.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
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

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  token?: string | null
) => {
  // ...
};

export function addAuthHeader(
  config: any,      // drop AxiosRequestConfig
  token: string
): any {            // drop AxiosRequestConfig
  const headers = (config.headers as Record<string, string>) || {};
  headers["Authorization"] = `Bearer ${token}`;
  return { ...config, headers };
}

export default axiosWithAuth;