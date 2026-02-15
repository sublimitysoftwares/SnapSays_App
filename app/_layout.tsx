import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  AuthProvider,
  useAuth as useAuthContext,
} from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import { useAuthGuard } from "../hooks/useAuthGuard";
import "./global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

function InitialLayout() {
  const { isLoading: isAuthLoading } = useAuthContext();

  // Custom hook to handle redirection logic
  useAuthGuard();

  useEffect(() => {
    if (!isAuthLoading) {
      // Small delay ensures the New Architecture has finished its first layout pass
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading]);

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemeWrapper>
            <NotificationProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <InitialLayout />
                </AuthProvider>
              </QueryClientProvider>
            </NotificationProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
