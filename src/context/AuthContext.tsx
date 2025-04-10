
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";

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
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        checkNetworkAndEnableOfflineMode();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && event === 'SIGNED_IN') {
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
            checkNetworkAndEnableOfflineMode();
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCurrentUser({
          id: userId,
          name: data.full_name,
          email: '', // Email is not stored in the profile for security reasons
          role: data.role,
          avatar: data.avatar_url || undefined
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setCurrentUser(null);
      throw error; // Rethrow to be caught by the caller
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // If we're offline and it's a demo account, allow login
      if (!navigator.onLine && email.includes('demo')) {
        // Simulate login for demo accounts when offline
        setCurrentUser({
          id: 'offline-user',
          name: 'Demo User',
          email: email,
          role: email.includes('admin') ? 'admin' : 'tester',
        });
        setIsOfflineMode(true);
        toast({
          title: "Offline login successful",
          description: "Using demo account in offline mode",
        });
        return true;
      }

      // Regular online login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          checkNetworkAndEnableOfflineMode();
          
          // For demo purposes, allow login with demo accounts even if connection fails
          if (email.includes('demo')) {
            setCurrentUser({
              id: 'offline-user',
              name: 'Demo User',
              email: email,
              role: email.includes('admin') ? 'admin' : 'tester',
            });
            toast({
              title: "Demo login successful",
              description: "Using limited functionality due to connection issues",
            });
            return true;
          }
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return false;
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
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
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
        checkNetworkAndEnableOfflineMode();
        
        // For demo purposes, allow login with demo accounts even if connection fails
        if (email.includes('demo')) {
          setCurrentUser({
            id: 'offline-user',
            name: 'Demo User',
            email: email,
            role: email.includes('admin') ? 'admin' : 'tester',
          });
          toast({
            title: "Demo login successful",
            description: "Using limited functionality due to connection issues",
          });
          return true;
        }
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (isOfflineMode) {
        // Just clear the user state if in offline mode
        setCurrentUser(null);
        setIsOfflineMode(false);
      } else {
        await supabase.auth.signOut();
        setCurrentUser(null);
      }
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
