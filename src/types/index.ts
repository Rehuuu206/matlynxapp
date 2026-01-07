// User roles in the system
export type UserRole = 'dealer' | 'contractor';

// User object stored in localStorage
export interface User {
  name: string;
  email: string;
  password: string; // In real app, this would be hashed
  phone: string;
  role: UserRole;
  createdAt: string;
}

// Material unit types
export type MaterialUnit = 'bags' | 'kg' | 'ton' | 'pieces' | 'cubic_meter' | 'sq_ft';

// Material object posted by dealers
export interface Material {
  id: string;
  dealerEmail: string;
  dealerName: string;
  dealerPhone: string;
  name: string;
  price: number;
  quantity: number;
  unit: MaterialUnit;
  description: string;
  imageUrl?: string; // Base64 or data URL for local storage
  isActive: boolean;
  priceUpdatedAt: string; // When price was last updated
  priceValidUntil?: string; // Optional: price validity end date
  createdAt: string;
  updatedAt: string;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
