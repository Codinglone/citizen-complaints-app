import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminProtectedRouteProps {
  requiredRole?: string[];
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ requiredRole }) => {
  const { isAdminAuthenticated, adminUser, isLoading } = useAdminAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Check authentication
  if (!isAdminAuthenticated || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return <Outlet />;
  }
  
  // Check if user has required role
  const hasRequiredRole = requiredRole.includes(adminUser.role);
  
  if (!hasRequiredRole) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
};