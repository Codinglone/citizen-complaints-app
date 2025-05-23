import axios from "axios";
import config from "../config";

// Log the base URL being used
console.log("API Client initialized with base URL:", config.apiUrl);

const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.VITE_API_URL : config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    }

    // Get the appropriate token based on the route
    const isAdminRoute = config.url?.includes('/admin');
    const token = localStorage.getItem(isAdminRoute ? 'adminToken' : 'token');
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the full request URL
    console.log(`Full request URL: ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  async (error) => {
    // Log error details
    console.error("API Error:", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      const isAdminRoute = error.config?.url?.includes('/admin');
      localStorage.removeItem(isAdminRoute ? 'adminToken' : 'token');
      window.location.href = isAdminRoute ? '/admin/login' : '/login';
    }

    // Return a more detailed error
    return Promise.reject({
      message: error.response?.data?.error || error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

export default apiClient; 