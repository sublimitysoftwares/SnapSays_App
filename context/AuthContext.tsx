import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  personalitySummary: { summary: string; hashtags: string[] } | null;
  setPersonalitySummary: (summary: { summary: string; hashtags: string[] } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [personalitySummary, setPersonalitySummary] = useState<{ summary: string; hashtags: string[] } | null>(null);

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
    <AuthContext.Provider value={{ 
      isSignedIn, setIsSignedIn, 
      isOnboarded, setIsOnboarded, 
      isLoading,
      answers, setAnswers,
      personalitySummary, setPersonalitySummary
    }}>
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
