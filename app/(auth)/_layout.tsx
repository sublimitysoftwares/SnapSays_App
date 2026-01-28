import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  // if (isSignedIn) {
  //   return <Redirect href={"/"} />;
  // }
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
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
      <StatusBar style="dark" />
    </>
  );
}
