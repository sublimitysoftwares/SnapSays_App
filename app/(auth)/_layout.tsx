import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import SafeScreen from "../component/SafeScreen";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }
  return (
    <View className="flex-1 bg-[#FAFAFA]">
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
      <StatusBar style="dark" />
    </View>
  );
}
