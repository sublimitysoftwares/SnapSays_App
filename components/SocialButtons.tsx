import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SocialButtonsProps {
  shareToLinkedIn: (data: string) => void;
  shareToInstagram: (data: string) => void;
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  shareToLinkedIn,
  shareToInstagram,
}) => {
  return (
    <View className="flex-row justify-center mt-6 gap-4">
      <TouchableOpacity
        onPress={() => shareToLinkedIn("LinkedIn")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#0077b5", "#005885"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20"
        >
          <Ionicons name="logo-linkedin" size={20} color="white" />
          <Text className="text-white font-bold ml-2">LinkedIn</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => shareToInstagram("Instagram")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center px-6 py-4 rounded-2xl shadow-lg border border-white/20"
        >
          <Ionicons name="logo-instagram" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Instagram</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SocialButtons;
