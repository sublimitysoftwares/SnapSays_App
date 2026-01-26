import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import InitialLayout from "./component/InitialLayout";

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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ClerkProvider
                tokenCache={tokenCache}
                publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
              >
                {/* <AuthGuard /> */}
                <InitialLayout />
              </ClerkProvider>
            </AuthProvider>
          </QueryClientProvider>
        </NotificationProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}
