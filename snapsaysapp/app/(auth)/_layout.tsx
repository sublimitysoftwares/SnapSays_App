import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../component/SafeScreen";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthLayout() {
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
