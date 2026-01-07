import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '@/lib/storage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (user: User) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = (email: string, password: string) => {
    const result = loginUser(email, password);
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true });
    }
    return result;
  };

  const register = (user: User) => {
    const result = registerUser(user);
    if (result.success) {
      // Auto-login after registration
      loginUser(user.email, user.password);
      setAuthState({ user, isAuthenticated: true });
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
