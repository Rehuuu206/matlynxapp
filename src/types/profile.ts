// Profile system types - separate from auth types

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Profile {
  userId: string; // Links to User email (unique identifier)
  fullName: string;
  role: 'dealer' | 'contractor'; // Read-only from auth
  shopName?: string; // Required for dealers
  companyName?: string; // Optional for contractors
  phone: string;
  whatsapp?: string; // Optional, defaults to phone
  address: Address;
  profilePhoto?: string; // Base64 data URL (MVP, will use storage later)
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// Validation helpers
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 12;
};

export const isProfileComplete = (profile: Profile | null): boolean => {
  if (!profile) return false;
  
  const hasBasicInfo = !!(profile.fullName && profile.phone && isValidPhone(profile.phone));
  const hasAddress = !!(profile.address.area && profile.address.city && profile.address.state && profile.address.pincode);
  const hasDealerInfo = profile.role === 'contractor' || !!profile.shopName;
  
  return hasBasicInfo && hasAddress && hasDealerInfo;
};
