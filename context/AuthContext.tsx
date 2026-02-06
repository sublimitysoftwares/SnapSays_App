import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id?: string;
  username: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  isSignedIn: boolean;
  user: User | null;
  pendingUser: { username: string; password: string } | null;
  setIsSignedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setPendingUser: (user: { username: string; password: string } | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = "snapsays_onboarded";
const USER_KEY = "snapsays_user";
const SIGNED_IN_KEY = "snapsays_signed_in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedInState] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [pendingUser, setPendingUserState] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [onboarded, userStr, signedIn] = await Promise.all([
          SecureStore.getItemAsync(ONBOARDING_KEY),
          SecureStore.getItemAsync(USER_KEY),
          SecureStore.getItemAsync(SIGNED_IN_KEY),
        ]);

        setIsOnboarded(onboarded === "true");
        setIsSignedInState(signedIn === "true");
        if (userStr) {
          setUserState(JSON.parse(userStr));
        }
      } catch (e) {
        console.error("Failed to check auth state", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const setIsSignedIn = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(SIGNED_IN_KEY, value ? "true" : "false");
      setIsSignedInState(value);
    } catch (e) {
      console.error("Failed to save signed in state", e);
    }
  };

  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
      setUserState(newUser);
    } catch (e) {
      console.error("Failed to save user state", e);
    }
  };

  const handleSetIsOnboarded = async (value: boolean) => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, value ? "true" : "false");
      setIsOnboarded(value);
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(SIGNED_IN_KEY),
      ]);
      setIsSignedInState(false);
      setUserState(null);
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  const setPendingUser = (
    user: { username: string; password: string } | null,
  ) => {
    setPendingUserState(user);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        pendingUser,
        setIsSignedIn,
        setUser,
        setPendingUser,
        isOnboarded,
        setIsOnboarded: handleSetIsOnboarded,
        isLoading,
        logout,
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
