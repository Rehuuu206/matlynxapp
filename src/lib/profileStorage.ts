import { Profile, isProfileComplete } from '@/types/profile';

const PROFILES_KEY = 'matlynx_profiles';

// Get all profiles
export const getProfiles = (): Profile[] => {
  const data = localStorage.getItem(PROFILES_KEY);
  return data ? JSON.parse(data) : [];
};

// Save all profiles
export const saveProfiles = (profiles: Profile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// Get profile by user ID (email)
export const getProfileByUserId = (userId: string): Profile | null => {
  const profiles = getProfiles();
  return profiles.find(p => p.userId.toLowerCase() === userId.toLowerCase()) || null;
};

// Create or update profile
export const saveProfile = (profile: Profile): void => {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(
    p => p.userId.toLowerCase() === profile.userId.toLowerCase()
  );
  
  const now = new Date().toISOString();
  const updatedProfile = {
    ...profile,
    isComplete: isProfileComplete(profile),
    updatedAt: now,
  };
  
  if (existingIndex !== -1) {
    profiles[existingIndex] = updatedProfile;
  } else {
    profiles.push({
      ...updatedProfile,
      createdAt: now,
    });
  }
  
  saveProfiles(profiles);
};

// Check if user has complete profile
export const hasCompleteProfile = (userId: string): boolean => {
  const profile = getProfileByUserId(userId);
  return isProfileComplete(profile);
};

// Delete profile
export const deleteProfile = (userId: string): void => {
  const profiles = getProfiles();
  const filtered = profiles.filter(
    p => p.userId.toLowerCase() !== userId.toLowerCase()
  );
  saveProfiles(filtered);
};
