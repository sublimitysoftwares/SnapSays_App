import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputFieldProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export default function InputField({ label, iconName, error, ...props }: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-1 text-base ml-1">{label}</Text>
      <View
        className={`flex-row items-center bg-white/80 rounded-2xl px-4 py-3 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:border-indigo-500 shadow-sm`}
      >
        <Ionicons name={iconName} size={20} color="#6366f1" className="mr-3" />
        <TextInput
          className="flex-1 text-gray-800 text-base py-0"
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
}
