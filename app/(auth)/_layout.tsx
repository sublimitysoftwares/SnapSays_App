import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#020617" },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            animation: "slide_from_left",
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            animation: "fade",
          }}
        />
      </Stack>
      <StatusBar style="light" translucent={true} />
    </>
  );
}
