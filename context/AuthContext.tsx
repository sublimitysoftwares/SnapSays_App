import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = "snapsays_onboarded";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const onboarded = await SecureStore.getItemAsync(ONBOARDING_KEY);
        setIsOnboarded(onboarded === "true");
      } catch (e) {
        console.error("Failed to check auth state", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSetIsOnboarded = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, value ? "true" : "false");
      setIsOnboarded(value);
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        isOnboarded,
        setIsOnboarded: handleSetIsOnboarded,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
