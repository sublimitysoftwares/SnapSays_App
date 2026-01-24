import { useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const segement = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthGroup = segement[0] === "(auth)";
    const inOnboarding = segement[0] === "onboarding";

    // Redirect signed-in users away from auth screens to tabs (but allow onboarding)
    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }

    // Redirect signed-out users to login if they're not on auth screens
    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, segement]);

  if (!isLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return <Slot />;
}
