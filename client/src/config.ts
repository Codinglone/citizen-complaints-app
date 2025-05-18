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

const config = {
  apiUrl: getApiUrl(),
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "",
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "",
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "",
  },
};

// Log configuration in development
if (process.env.NODE_ENV !== "production") {
  console.log("API URL:", config.apiUrl);
}

export default config; 