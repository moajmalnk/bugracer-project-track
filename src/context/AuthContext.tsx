
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { mockDataStore } from '@/lib/mockData';
import { api } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOfflineMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const user = mockDataStore.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        checkNetworkAndEnableOfflineMode();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Listen for online/offline events
    const handleOnline = () => {
      if (isOfflineMode) {
        toast({
          title: "You are back online",
          description: "Reconnected to the server"
        });
        setIsOfflineMode(false);
      }
    };
    
    const handleOffline = () => {
      toast({
        title: "You are offline",
        description: "Using offline mode with limited functionality",
        variant: "destructive",
      });
      setIsOfflineMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOfflineMode]);

  const checkNetworkAndEnableOfflineMode = () => {
    if (!navigator.onLine) {
      setIsOfflineMode(true);
      toast({
        title: "You are offline",
        description: "Using offline mode with limited functionality",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connection issue",
        description: "Cannot connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // If we're offline and it's a demo account, allow login
      if (!navigator.onLine && email.includes('demo')) {
        // Simulate login for demo accounts when offline
        const user = mockDataStore.getCurrentUser() || {
          id: 'offline-user',
          name: 'Demo User',
          email: email,
          role: email.includes('admin') ? 'admin' : 'tester',
        };
        setCurrentUser(user);
        setIsOfflineMode(true);
        toast({
          title: "Offline login successful",
          description: "Using demo account in offline mode",
        });
        return true;
      }

      // Regular login
      const { user, token } = await mockDataStore.loginUser(email, password);
      
      if (user) {
        setCurrentUser(user);
        api.setToken(token);
        toast({
          title: "Login successful",
          description: "Welcome to BugRacer!",
        });
        setIsOfflineMode(false);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        checkNetworkAndEnableOfflineMode();
        
        // For demo purposes, allow login with demo accounts even if offline
        if (email.includes('demo')) {
          const user = {
            id: 'offline-user',
            name: 'Demo User',
            email: email,
            role: email.includes('admin') ? 'admin' : 'tester',
          };
          setCurrentUser(user);
          toast({
            title: "Demo login successful",
            description: "Using limited functionality due to connection issues",
          });
          return true;
        }
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      mockDataStore.logout();
      api.setToken(null);
      setCurrentUser(null);
      setIsOfflineMode(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isLoading,
    isOfflineMode
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
