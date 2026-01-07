import { User, Material } from '@/types';

// Storage keys
const USERS_KEY = 'matlynx_users';
const CURRENT_USER_KEY = 'matlynx_current_user';
const MATERIALS_KEY = 'matlynx_materials';

// User storage functions
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const registerUser = (user: User): { success: boolean; error?: string } => {
  const existing = findUserByEmail(user.email);
  if (existing) {
    return { success: false, error: 'Email already registered' };
  }
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return { success: true };
};

export const loginUser = (email: string, password: string): { success: boolean; user?: User; error?: string } => {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password' };
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Material storage functions
export const getMaterials = (): Material[] => {
  const data = localStorage.getItem(MATERIALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveMaterials = (materials: Material[]): void => {
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
};

export const getMaterialsByDealer = (dealerEmail: string): Material[] => {
  const materials = getMaterials();
  return materials.filter(m => m.dealerEmail === dealerEmail);
};

export const getActiveMaterials = (): Material[] => {
  const materials = getMaterials();
  return materials.filter(m => m.isActive);
};

export const addMaterial = (material: Material): void => {
  const materials = getMaterials();
  materials.push(material);
  saveMaterials(materials);
};

export const updateMaterial = (id: string, updates: Partial<Material>): void => {
  const materials = getMaterials();
  const index = materials.findIndex(m => m.id === id);
  if (index !== -1) {
    materials[index] = { ...materials[index], ...updates, updatedAt: new Date().toISOString() };
    saveMaterials(materials);
  }
};

export const deleteMaterial = (id: string): void => {
  const materials = getMaterials();
  const filtered = materials.filter(m => m.id !== id);
  saveMaterials(filtered);
};

export const toggleMaterialActive = (id: string): void => {
  const materials = getMaterials();
  const material = materials.find(m => m.id === id);
  if (material) {
    material.isActive = !material.isActive;
    material.updatedAt = new Date().toISOString();
    saveMaterials(materials);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
