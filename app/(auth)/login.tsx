import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const APP_LOGO = require("../../assets/images/app_logo.png");

import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import { useAuth } from "../../context/AuthContext";
import SafeScreen from "../component/SafeScreen";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setIsSignedIn, setUser, setIsOnboarded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [reset]);

  const onLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const apiUrl = `http://fapindetails.sublimitysoft.com/api/api//Common/FetchUser?Username=${encodeURIComponent(
        data.username,
      )}&Password=${encodeURIComponent(data.password)}`;

      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result.ResponseCode === 200) {
        // Success
        setUser(result.Data);
        setIsSignedIn(true);
        // If user logs in successfully, we consider them onboarded for this session/device flow
        setIsOnboarded(true);

        if (result.Data.User_Personality_Details) {
          await AsyncStorage.setItem(
            "user_personality",
            JSON.stringify(result.Data.User_Personality_Details),
          );
        }

        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Failed",
          result.ResponseMessage || "Invalid credentials",
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_facebook") => {
    // Keeping SSO placeholders for now, but they might need separate integration if Clerk is removed completely.
    // For now, let's focus on the main login API.
    Alert.alert(
      "Info",
      `Social login with ${strategy} is not implemented with the custom API yet.`,
    );
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <SafeScreen>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#FFB347"]}
                tintColor="#FFB347"
              />
            }
          >
            <View className="px-8 pt-12 pb-10">
              {/* Logo Section */}
              <View className="items-center mb-8">
                <Image
                  source={APP_LOGO}
                  className="w-24 h-24"
                  resizeMode="contain"
                />
              </View>

              {/* Header Section */}
              <View className="mb-10">
                <Text className="text-[#1A1A1A] text-3xl font-bold mb-2">
                  Login Account
                </Text>
                <Text className="text-gray-400 text-base">
                  Hello, Welcome back to our account!
                </Text>
              </View>

              {/* Form Section */}
              <View>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Username"
                      placeholder="Enter your username"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.username?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Password"
                      placeholder="**********"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
                    />
                  )}
                />

                <TouchableOpacity className="self-end mb-6">
                  <Text className="text-gray-400 font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <CustomButton
                  title="Sign In"
                  onPress={handleSubmit(onLogin)}
                  loading={loading}
                  variant="orange"
                />

                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-[1px] bg-gray-200" />
                  <Text className="mx-4 text-gray-400 font-medium">
                    Or Sign In With
                  </Text>
                  <View className="flex-1 h-[1px] bg-gray-200" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row gap-4">
                  <SocialButton
                    type="facebook"
                    onPress={() => handleSSO("oauth_facebook")}
                  />
                  <SocialButton
                    type="google"
                    onPress={() => handleSSO("oauth_google")}
                  />
                </View>
              </View>

              {/* Footer Section */}
              <View className="flex-row justify-center mt-12">
                <Text className="text-gray-400 text-[15px]">
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signup" as any)}
                >
                  <Text className="text-[#FFB347] font-bold text-[15px]">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeScreen>
    </View>
  );
}
