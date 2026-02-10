import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAFA",
        }}
      >
        <ActivityIndicator size="large" color="#FFB347" />
      </View>
    );
  }

  // If signed in, let the AuthGuard handle specific routing (like onboarding check),
  // or jump straight to tabs if we want to be aggressive.
  // The safest bet is to redirect to tabs if signed in, or login if not.
  // The AuthGuard in _layout will correct us if we need to go to Onboarding.
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
