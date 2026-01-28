import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import SafeScreen from "../component/SafeScreen";

import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setIsSignedIn } = useAuth();
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
      email: "",
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

  const onLogin = (data: LoginFormData) => {
    setLoading(true);
    console.log("Login data:", data);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSignedIn(true);
      // Navigate to onboarding screen after successful login
      router.replace("/(auth)/onboarding" as any);
    }, 1500);
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
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Email"
                      placeholder="name@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.email?.message}
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
                  <SocialButton type="facebook" onPress={() => {}} />
                  <SocialButton type="google" onPress={() => {}} />
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
