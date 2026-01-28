import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { isSignedIn: isClerkSignedIn, isLoaded } = useClerkAuth();
  const { isOnboarded, setIsSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Sync Clerk auth state with custom AuthContext
    if (isClerkSignedIn) {
      setIsSignedIn(true);

      // Check if user has completed onboarding
      if (isOnboarded) {
        router.replace("/(tabs)");
      } else {
        // Redirect to onboarding if not completed
        router.replace("/(auth)/onboarding");
      }
    } else {
      router.replace("/(auth)/login");
    }
  }, [isClerkSignedIn, isLoaded, isOnboarded]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4f46e5" />
    </View>
  );
}
