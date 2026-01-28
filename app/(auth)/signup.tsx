import { useSSO } from "@clerk/clerk-expo";
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

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
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
      fullName: "",
      email: "",
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

  const onSignUp = (data: SignupFormData) => {
    setLoading(true);
    console.log("Signup data:", data);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/(auth)/onboarding");
    }, 1500);
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_facebook") => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: strategy,
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/(auth)/onboarding");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Full Name"
                      placeholder="Shariar Hossain"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.fullName?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Email"
                      placeholder="uixshariar@gmail.com"
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
                      label="Create Password"
                      placeholder="**********"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
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
                    />
                  )}
                />

                <CustomButton
                  title="Sign Up"
                  onPress={handleSubmit(onSignUp)}
                  loading={loading}
                  variant="orange"
                  className="mt-4"
                />

                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-[1px] bg-gray-200" />
                  <Text className="mx-4 text-gray-400 font-medium">
                    Or Sign Up With
                  </Text>
                  <View className="flex-1 h-[1px] bg-gray-200" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row gap-4">
                  <SocialButton
                    type="facebook"
                    onPress={() => handleSSO("oauth_facebook" as any)}
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
                  <Text className="text-[#FFB347] font-bold text-[15px]">
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
