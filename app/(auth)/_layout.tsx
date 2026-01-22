import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../component/SafeScreen";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }
  return (
    <LinearGradient
      colors={["#4f46e5", "#312e81", "#1e1b4b"]}
      className="flex-1"
    >
      <SafeScreen>
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
        </Stack>
      </SafeScreen>
      <StatusBar style="light" />
    </LinearGradient>
  );
}
