const getApiUrl = () => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("VITE_API_URL is not set in production!");
      return "http://localhost:3001"; // Fallback for development
    }
    return apiUrl;
  }
  // In development, use localhost
  return "http://localhost:3001";
};

const getCallbackUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:3000';
};

const config = {
  apiUrl: getApiUrl(),
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || "",
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "",
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || "",
    redirectUri: getCallbackUrl(),
  },
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log("API URL:", config.apiUrl);
  console.log("Callback URL:", config.auth0.redirectUri);
}

export default config; 