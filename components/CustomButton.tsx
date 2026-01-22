import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  className = '',
}: CustomButtonProps) {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      className={`rounded-2xl overflow-hidden shadow-lg ${className}`}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 px-6 items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">{title}</Text>
          )}
        </LinearGradient>
      ) : (
        <View
          className={`py-4 px-6 items-center justify-center ${
            isOutline ? 'border-2 border-indigo-500 bg-transparent' : 'bg-gray-100'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#6366f1" />
          ) : (
            <Text
              className={`font-bold text-lg ${
                isOutline ? 'text-indigo-600' : 'text-gray-800'
              }`}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
