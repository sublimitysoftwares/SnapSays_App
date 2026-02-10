import { zodResolver } from "@hookform/resolvers/zod";
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

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const { setPendingUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [reset]);

  const onSignUp = async (data: SignupFormData) => {
    setLoading(true);
    try {
      // For custom signup with onboarding, we store the info and proceed to onboarding
      setPendingUser({
        username: data.username,
        password: data.password,
      });

      router.push("/(auth)/onboarding");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_facebook") => {
    Alert.alert(
      "Info",
      `Social signup with ${strategy} is not implemented yet.`,
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
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
                colors={["#2563EB"]}
                tintColor="#2563EB"
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
                <Text className="text-white text-3xl font-bold mb-2">
                  Sign Up Account
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
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.username?.message}
                      containerClassName="bg-slate-900 border-slate-800"
                      inputClassName="text-white"
                      placeholderTextColor="#64748b"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Create Password"
                      placeholder="**********"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
                      containerClassName="bg-slate-900 border-slate-800"
                      inputClassName="text-white"
                      placeholderTextColor="#64748b"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Confirm Password"
                      placeholder="**********"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.confirmPassword?.message}
                      containerClassName="bg-slate-900 border-slate-800"
                      inputClassName="text-white"
                      placeholderTextColor="#64748b"
                    />
                  )}
                />

                <CustomButton
                  title="Sign Up"
                  onPress={handleSubmit(onSignUp)}
                  loading={loading}
                  variant="blue"
                  className="mt-4"
                />

                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-[1px] bg-slate-800" />
                  <Text className="mx-4 text-gray-500 font-medium">
                    Or Sign Up With
                  </Text>
                  <View className="flex-1 h-[1px] bg-slate-800" />
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
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/login" as any)}
                >
                  <Text className="text-blue-500 font-bold text-[15px]">
                    Sign In
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
