import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

interface ProfileGuardProps {
  children: React.ReactNode;
}

/**
 * ProfileGuard - Ensures user has completed their profile before accessing dashboard
 * Redirects to /profile-setup if profile is incomplete
 */
const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isProfileComplete, isLoading } = useProfile();

  // Don't redirect while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Not authenticated - let ProtectedRoute handle this
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Profile incomplete - redirect to setup
  if (!isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  // Profile complete - render children
  return <>{children}</>;
};

export default ProfileGuard;
