import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import SocialButton from '../../components/SocialButton';

import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setIsSignedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSignedIn(true);
      // Let the AuthGuard handle the redirection
    }, 1500);
  };

  return (
    <View className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="flex-1 px-6 justify-center py-10">
              {/* Header Section */}
              <View className="items-center mb-10">
                <View className="w-24 h-24 mb-4">
                  <Image 
                    source={require('../../assets/images/logoMain.png')} 
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-white text-4xl font-black tracking-tight">
                  SnapSays
                </Text>
                <Text className="text-indigo-200 text-lg">
                  Welcome back to the future
                </Text>
              </View>

              {/* Form Section */}
              <View className="bg-white/10 p-6 rounded-[40px] border border-white/20 backdrop-blur-xl">
                <Text className="text-white text-2xl font-bold mb-6 text-center">
                  Login Account
                </Text>
                
                <InputField
                  label="Email Address"
                  iconName="mail-outline"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <InputField
                  label="Password"
                  iconName="lock-closed-outline"
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity className="self-end mb-6">
                  <Text className="text-indigo-300 font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                <CustomButton
                  title="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                />

                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-[1px] bg-white/20" />
                  <Text className="mx-4 text-white/50 font-medium">Or continue with</Text>
                  <View className="flex-1 h-[1px] bg-white/20" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row space-x-4 gap-4">
                  <SocialButton type="google" onPress={() => {}} />
                  {/* <SocialButton type="apple" onPress={() => {}} /> */}
                </View>
              </View>

              {/* Footer Section */}
              <View className="flex-row justify-center mt-10">
                <Text className="text-white/70 text-base">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                  <Text className="text-white font-bold text-base underline decoration-indigo-400">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
}
