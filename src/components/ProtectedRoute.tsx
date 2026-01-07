import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

/**
 * ProtectedRoute - Ensures only authenticated users with the correct role can access a route
 * Redirects to /auth if not authenticated
 * Redirects to the correct dashboard if role doesn't match
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  // Not logged in - redirect to auth
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Wrong role - redirect to correct dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'dealer' ? '/dealer' : '/contractor'} replace />;
  }

  // Authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;
