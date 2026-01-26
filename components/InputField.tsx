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
}

export default function InputField({
  label,
  iconName,
  error,
  showIcon = false,
  secureTextEntry,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-400 font-medium mb-1.5 text-base ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-white rounded-full px-5 py-3.5 border ${
          error ? "border-red-500" : "border-gray-100"
        } shadow-sm`}
      >
        {iconName && showIcon && (
          <Ionicons
            name={iconName}
            size={20}
            color="#9ca3af"
            className="mr-3"
          />
        )}
        <TextInput
          className="flex-1 text-gray-800 text-[15px] py-0"
          placeholderTextColor="#cbd5e1"
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
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
}
