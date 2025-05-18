const config = {
  apiUrl: process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "https://your-ngrok-url.ngrok.io"
    : "http://localhost:3001",
  auth0: {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "",
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "",
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "",
  },
};

export default config; 