export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  token?: string | null
) => {
  // Add debugging information
  console.log(`🔍 API Request: ${options.method || "GET"} ${url}`);

  // Add auth header if token is provided
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("🔑 Using auth token");
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Log response details
    console.log(`📡 Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // Try to get more error details if available
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        // Ignore error parsing issues
      }

      throw new Error(
        `Request failed: ${response.status} ${response.statusText}${
          errorDetails ? ` - ${errorDetails}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("🚨 API Error:", error);
    throw error;
  }
};

export function addAuthHeader(
  config: import('axios').AxiosRequestConfig,
  token: string
): import('axios').AxiosRequestConfig {
  const headers = (config.headers as Record<string, string>) || {};
  headers["Authorization"] = `Bearer ${token}`;
  return { ...config, headers };
}
