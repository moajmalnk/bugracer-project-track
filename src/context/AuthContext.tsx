
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Sample users for demo purposes
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@bugracer.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
  },
  {
    id: '2',
    name: 'Developer User',
    email: 'developer@bugracer.com',
    role: 'developer',
    avatar: 'https://ui-avatars.com/api/?name=Developer+User&background=10b981&color=fff',
  },
  {
    id: '3',
    name: 'Tester User',
    email: 'tester@bugracer.com',
    role: 'tester',
    avatar: 'https://ui-avatars.com/api/?name=Tester+User&background=f59e0b&color=fff',
  },
];

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = DEMO_USERS.find(u => u.email === email);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
