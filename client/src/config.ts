const getApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not set in production!");
      return "http://localhost:3001"; // Fallback for development
    }
    return apiUrl;
  }
  return "http://localhost:3001";
};

const getCallbackUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL || 'http://localhost:3000';
};

const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "",
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "",
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "",
    redirectUri: getCallbackUrl(),
  },
};

// Log configuration in development
if (process.env.NODE_ENV !== "production") {
  console.log("API URL:", config.apiUrl);
  console.log("Callback URL:", config.auth0.redirectUri);
}

export default config; 