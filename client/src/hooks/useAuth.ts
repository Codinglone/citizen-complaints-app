import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  picture?: string;
}

export const useAuth = () => {
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isLoading,
    error,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // For debugging
    if (auth0User) {
      console.log("Auth0 user object:", auth0User);
    }

    if (isAuthenticated && auth0User) {
      setUser({
        id: auth0User.sub || "",
        fullName: auth0User.name || "",
        email: auth0User.email || "",
        role: "citizen", // Default role
        picture: auth0User.picture,
      });
    } else {
      setUser(null);
    }
  }, [isAuthenticated, auth0User]);

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  const handleRedirectCallback = async () => {
    // Simple implementation that redirects to the dashboard after auth
    window.location.href = "/dashboard";
  };

  // Return the getToken function
  const getTokenFromLocal = () => {
    return (
      localStorage.getItem("authToken") || localStorage.getItem("adminToken")
    );
  };

  return {
    isAuthenticated,
    user,
    login,
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
    getToken: getTokenFromLocal,
    isLoading,
    error,
    handleRedirectCallback,
  };
};
