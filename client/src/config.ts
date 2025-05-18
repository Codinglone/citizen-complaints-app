const getApiUrl = () => {
  // Use the environment variable in both development and production
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error("VITE_API_URL is not set! Using fallback URL.");
    return import.meta.env.NODE_ENV === "production" 
      ? "https://citizen-complaints-app.onrender.com/api" 
      : "http://localhost:5000/api";
  }
  
  console.log(`Using API URL: ${apiUrl}`);
  return apiUrl;
};

const getCallbackUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return origin;
  }
  const fallback = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:5173';
  return fallback;
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
if (import.meta.env.NODE_ENV === "development") {
  console.log("Development Configuration:", {
    apiUrl: config.apiUrl,
    callbackUrl: config.auth0.redirectUri,
    auth0Domain: config.auth0.domain,
    auth0ClientId: config.auth0.clientId,
    auth0Audience: config.auth0.audience,
  });
} else {
  console.log("Production Configuration:", {
    apiUrl: config.apiUrl,
    callbackUrl: config.auth0.redirectUri,
    auth0Domain: config.auth0.domain ? "Set" : "Not Set",
    auth0ClientId: config.auth0.clientId ? "Set" : "Not Set",
    auth0Audience: config.auth0.audience ? "Set" : "Not Set",
  });
}

export default config;