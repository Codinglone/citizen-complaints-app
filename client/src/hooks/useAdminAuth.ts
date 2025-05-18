import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string | null;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');
        
        if (!token || !storedUser) {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
          setIsLoading(false);
          return;
        }
        
        // Parse the stored user data
        const user: AdminUser = JSON.parse(storedUser);
        
        // Verify the token with the server
        const response = await fetch(`${process.env.VITE_API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Token is valid
          setIsAdminAuthenticated(true);
          setAdminUser(user);
        } else {
          // Token is invalid, clear localStorage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsAdminAuthenticated(false);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token and user data in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Update state
        setIsAdminAuthenticated(true);
        setAdminUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logoutAdmin = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Update state
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    
    // Redirect to login page
    navigate('/admin/login');
  };

  const getAdminToken = () => {
    return localStorage.getItem('adminToken');
  };

  return {
    adminUser,
    isAdminAuthenticated,
    isLoading,
    loginAdmin,
    logoutAdmin,
    getAdminToken
  };
};