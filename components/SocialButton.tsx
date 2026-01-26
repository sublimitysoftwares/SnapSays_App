import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface SocialButtonProps {
  type: "google" | "facebook" | "apple";
  onPress: () => void;
}

export default function SocialButton({ type, onPress }: SocialButtonProps) {
  const isGoogle = type === "google";
  const isFacebook = type === "facebook";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 flex-row items-center justify-center py-3.5 rounded-full border border-gray-100 bg-white"
    >
      {isGoogle ? (
        <Ionicons
          name="logo-google"
          size={20}
          color="#DB4437"
          className="mr-2"
        />
      ) : isFacebook ? (
        <FontAwesome
          name="facebook"
          size={20}
          color="#1877F2"
          className="mr-2"
        />
      ) : (
        <FontAwesome name="apple" size={20} color="#000000" className="mr-2" />
      )}
      <Text className="text-gray-800 font-semibold text-[15px]">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}
