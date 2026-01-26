import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";

const queryClient = new QueryClient();

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useAppTheme();
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

function InitialLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
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
                  <ClerkProvider
                    tokenCache={tokenCache}
                    publishableKey={
                      process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
                    }
                  >
                    <InitialLayout />
                  </ClerkProvider>
                </AuthProvider>
              </QueryClientProvider>
            </NotificationProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
