import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a stored token
    const checkAuth = async () => {
      try {
        // Here you would check for a token and onboarding status in SecureStore or AsyncStorage
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSignedIn(false);
        setIsOnboarded(false); // Default to not onboarded
      } catch (e) {
        console.error("Failed to check auth state", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, isOnboarded, setIsOnboarded, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
