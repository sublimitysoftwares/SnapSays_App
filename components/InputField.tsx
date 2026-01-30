import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  glassmorphic?: boolean;
}

export default function InputField({
  label,
  iconName,
  error,
  showIcon = true,
  showLabel = true,
  glassmorphic = false,
  secureTextEntry,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      {showLabel && (
        <Text className={`font-medium mb-1.5 text-base ml-1 ${glassmorphic ? 'text-white/80' : 'text-gray-400'}`}>
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-full px-5 py-3.5 border ${
          glassmorphic 
            ? 'bg-white/20 border-white/30 backdrop-blur-xl' 
            : `bg-white ${error ? "border-red-500" : "border-gray-100"} shadow-sm`
        }`}
      >
        {iconName && showIcon && (
          <Ionicons
            name={iconName}
            size={20}
            color={glassmorphic ? "#ffffff" : "#9ca3af"}
            className="mr-3"
          />
        )}
        <TextInput
          className={`flex-1 text-[15px] py-0 ${glassmorphic ? 'text-white' : 'text-gray-800'}`}
          placeholderTextColor={glassmorphic ? "#ffffff80" : "#cbd5e1"}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={glassmorphic ? "#ffffff" : "#9ca3af"}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className={`text-sm mt-1 ml-1 ${glassmorphic ? 'text-red-300' : 'text-red-500'}`}>{error}</Text>}
    </View>
  );
}
