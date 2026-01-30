import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={['#FF5ACD', '#BB65FF', '#4BB1FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
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
                colors={["#fff"]}
                tintColor="#fff"
              />
            }
          >
            <View className="flex-1 px-6 justify-center py-20">
              {/* Header Section */}
              <View className="items-center mb-12">
                <Text className="text-white text-[45px] font-black tracking-tighter text-center leading-[50px]">
                  Let's make{"\n"}your snaps say{"\n"}more ✨
                </Text>
              </View>

              {/* Form Section */}
              <View className="bg-white/10 p-2 rounded-[40px] border border-white/20 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <View className="p-4">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        label="Email"
                        iconName="mail-outline"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.email?.message}
                        showLabel={false}
                        glassmorphic={true}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        label="Password"
                        iconName="lock-closed-outline"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                        showLabel={false}
                        glassmorphic={true}
                      />
                    )}
                  />

                  <CustomButton
                    title="Login"
                    onPress={handleSubmit(onLogin)}
                    loading={loading}
                    variant="primary"
                  />

                  <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-white/20" />
                    <Text className="mx-4 text-white/50 font-medium">or</Text>
                    <View className="flex-1 h-[1px] bg-white/20" />
                  </View>

                  {/* Social Login Buttons */}
                  <SocialButton type="google" onPress={() => {}} />
                  <SocialButton type="apple" onPress={() => {}} />
                </View>
              </View>

              {/* Footer Section */}
              <View className="flex-row justify-center mt-8">
                <Text className="text-white/70 text-base">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signup" as any)}
                >
                  <Text className="text-white font-bold text-base underline decoration-white">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeScreen>
    </LinearGradient>
  );
}
