const getApiUrl = () => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("VITE_API_URL is not set in production!");
      return "http://localhost:5000"; // Fallback for development
    }
    console.log("Using production API URL:", apiUrl);
    return apiUrl;
  }
  // In development, use the proxy
  console.log("Using development API URL with proxy");
  return ""; // Empty string means use relative URLs, which will be handled by the Vite proxy
};

const getCallbackUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log("Using callback URL from window origin:", origin);
    return origin;
  }
  const fallback = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:5173';
  console.log("Using fallback callback URL:", fallback);
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
if (import.meta.env.DEV) {
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