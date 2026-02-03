import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useAuthGuard() {
  const { isSignedIn, isOnboarded, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding =
      segments[0] === "(auth)" && segments[1] === "onboarding";
    const isSSOCallback = segments[0] === "sso-callback";

    if (!isSignedIn) {
      if (!inAuthGroup && !isSSOCallback) {
        // Redirect to login if not signed in and not in auth group or sso-callback
        router.replace("/(auth)/login" as any);
      }
    } else {
      // Signed in logic
      if (!isOnboarded && !inOnboarding) {
        // Redirect to onboarding if signed in but not onboarded
        router.replace("/(auth)/onboarding" as any);
      } else if (
        isOnboarded &&
        (inAuthGroup || inOnboarding || isSSOCallback)
      ) {
        // Redirect to home if signed in, onboarded, and in auth, onboarding or sso-callback
        router.replace("/(tabs)" as any);
      } else if (!isOnboarded && isSSOCallback) {
        // Redirect to onboarding from sso-callback if not onboarded
        router.replace("/(auth)/onboarding" as any);
      }
    }
  }, [isSignedIn, isOnboarded, segments, isLoading]);
}
