import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import { useAuth as useAuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setIsSignedIn } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const profileOptions = [
    { title: "Edit Profile", icon: "person-outline", color: "#4f46e5" },
    { title: "Notifications", icon: "notifications-outline", color: "#f59e0b" },
    {
      title: "Privacy & Security",
      icon: "shield-checkmark-outline",
      color: "#10b981",
    },
    { title: "Help & Support", icon: "help-circle-outline", color: "#6366f1" },
  ];

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header / Background Shape */}
      <View className="bg-indigo-600 h-48 rounded-b-[40px] items-center justify-center relative shadow-lg">
        <View className="absolute -bottom-16 items-center">
          <View className="p-1 bg-white rounded-full shadow-xl">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-32 h-32 rounded-full"
            />
          </View>
        </View>
      </View>

      {/* User Info Section */}
      <View className="mt-20 px-6 items-center">
        <Text className="text-2xl font-black text-gray-800">
          {user.fullName || "User"}
        </Text>
        <Text className="text-gray-500 font-medium mt-1">
          {user.primaryEmailAddress?.emailAddress}
        </Text>

        <TouchableOpacity className="mt-4 bg-indigo-100 px-6 py-2 rounded-full border border-indigo-200">
          <Text className="text-indigo-600 font-bold">Manage Account</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around mt-10 px-6">
        <View className="items-center bg-white p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100">
          <Text className="text-xl font-black text-indigo-600">12</Text>
          <Text className="text-gray-400 text-xs font-bold uppercase mt-1">
            Saved
          </Text>
        </View>
        <View className="items-center bg-white p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100">
          <Text className="text-xl font-black text-indigo-600">48</Text>
          <Text className="text-gray-400 text-xs font-bold uppercase mt-1">
            Captions
          </Text>
        </View>
        <View className="items-center bg-white p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100">
          <Text className="text-xl font-black text-indigo-600">02</Text>
          <Text className="text-gray-400 text-xs font-bold uppercase mt-1">
            Drafts
          </Text>
        </View>
      </View>

      {/* Settings Options */}
      <View className="mt-10 px-6 bg-white mx-6 rounded-3xl shadow-sm border border-gray-100 py-2">
        {profileOptions.map((option, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity className="flex-row items-center justify-between py-4 px-2">
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${option.color}15` }}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color={option.color}
                  />
                </View>
                <Text className="text-gray-700 text-lg font-semibold">
                  {option.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
            {index < profileOptions.length - 1 && (
              <Divider className="bg-gray-100 mx-2" />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-10 mb-12 mx-6 bg-red-50 py-4 rounded-2xl flex-row justify-center items-center border border-red-100"
      >
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text className="ml-2 text-red-500 font-bold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
