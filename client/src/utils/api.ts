import config from "../config";
import { useCallback } from 'react';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  // Use useCallback to memoize the function reference
  const fetchWithAuth = useCallback(async (url: string, options: RequestOptions = {}) => {
    const {
      method = "GET",
      body,
      requireAuth = true,
      headers: customHeaders = {},
      signal,
    } = options;

    const headers = new Headers({
      "Content-Type": "application/json",
      ...customHeaders,
    });

    if (requireAuth) {
      console.log("Adding auth token to request");
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      } else {
        console.log("No token available for authenticated request");
      }
    }

    // Construct the full URL with the API base URL
    const fullUrl = url.startsWith("http")
      ? url
      : `${config.apiUrl}${url.startsWith("/") ? "" : "/"}${url}`;
      
    // Only log once when actually making requests
    console.log("Making API request to:", fullUrl);

    return fetch(fullUrl, {
      method,
      headers,
      body: body ? body : undefined,
      signal,
    });
  }, []); // Empty dependency array since nothing inside depends on props/state

  return { fetchWithAuth };
};
