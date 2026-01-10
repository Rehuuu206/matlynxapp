import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, isProfileComplete } from '@/types/profile';
import { getProfileByUserId, saveProfile as saveProfileStorage } from '@/lib/profileStorage';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileContextType {
  profile: Profile | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  saveProfile: (profile: Omit<Profile, 'userId' | 'role' | 'createdAt' | 'updatedAt' | 'isComplete'>) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadProfile = () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const existingProfile = getProfileByUserId(user.email);
    setProfile(existingProfile);
    setIsLoading(false);
  };

  const refreshProfile = () => {
    loadProfile();
  };

  const saveProfile = (profileData: Omit<Profile, 'userId' | 'role' | 'createdAt' | 'updatedAt' | 'isComplete'>) => {
    if (!user) return;

    const now = new Date().toISOString();
    const existingProfile = getProfileByUserId(user.email);
    
    const fullProfile: Profile = {
      ...profileData,
      userId: user.email,
      role: user.role,
      isComplete: false, // Will be calculated in storage
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    saveProfileStorage(fullProfile);
    setProfile({ ...fullProfile, isComplete: isProfileComplete(fullProfile) });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isProfileComplete: isProfileComplete(profile),
        isLoading,
        saveProfile,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
