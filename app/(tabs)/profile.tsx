import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";
import { Colors } from "../../constants/Colors";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setIsSignedIn } = useAuthContext();
  const { isDark, toggleTheme } = useAppTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const profileOptions = [
    { title: "Edit Profile", icon: "person-outline", color: Colors.light.tint },
    {
      title: "Notifications",
      icon: "notifications-outline",
      color: Colors.palette.warning,
    },
    {
      title: "Privacy & Security",
      icon: "shield-checkmark-outline",
      color: Colors.palette.success,
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline",
      color: Colors.light.secondary,
    },
  ];

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-950">
      {/* Header / Background Shape */}
      <View className="bg-indigo-600 h-48 rounded-b-[40px] items-center justify-center relative shadow-lg">
        <View className="absolute -bottom-16 items-center">
          <View className="p-1 bg-white dark:bg-slate-800 rounded-full shadow-xl">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-32 h-32 rounded-full"
            />
          </View>
        </View>
      </View>

      {/* User Info Section */}
      <View className="mt-20 px-6 items-center">
        <Text className="text-2xl font-black text-gray-800 dark:text-white">
          {user.fullName || "User"}
        </Text>
        <Text className="text-gray-500 font-medium mt-1 dark:text-gray-400">
          {user.primaryEmailAddress?.emailAddress}
        </Text>

        <TouchableOpacity className="mt-4 bg-indigo-100 dark:bg-indigo-900/30 px-6 py-2 rounded-full border border-indigo-200 dark:border-indigo-800">
          <Text className="text-indigo-600 dark:text-indigo-400 font-bold">
            Manage Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around mt-10 px-6">
        <View className="items-center bg-white dark:bg-slate-900 p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100 dark:border-slate-800">
          <Text className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            12
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mt-1">
            Saved
          </Text>
        </View>
        <View className="items-center bg-white dark:bg-slate-900 p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100 dark:border-slate-800">
          <Text className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            48
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mt-1">
            Captions
          </Text>
        </View>
        <View className="items-center bg-white dark:bg-slate-900 p-4 rounded-3xl w-[30%] shadow-sm border border-gray-100 dark:border-slate-800">
          <Text className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            02
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mt-1">
            Drafts
          </Text>
        </View>
      </View>

      {/* Theme Toggle Section */}
      <View className="mt-10 px-6 bg-white dark:bg-slate-900 mx-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 py-2">
        <View className="flex-row items-center justify-between py-4 px-2">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl items-center justify-center mr-4 bg-indigo-50 dark:bg-indigo-900/30">
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={22}
                color={isDark ? Colors.dark.tint : Colors.palette.warning}
              />
            </View>
            <Text className="text-gray-700 dark:text-slate-200 text-lg font-semibold">
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            color={Colors.light.tint}
          />
        </View>
      </View>

      {/* Settings Options */}
      {/* <View className="mt-6 px-6 bg-white dark:bg-slate-900 mx-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 py-2">
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
                <Text className="text-gray-700 dark:text-slate-200 text-lg font-semibold">
                  {option.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
            {index < profileOptions.length - 1 && (
              <Divider className="bg-gray-100 dark:bg-slate-800 mx-2" />
            )}
          </React.Fragment>
        ))}
      </View> */}

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-6 mb-12 mx-6 bg-red-50 dark:bg-red-900/10 py-4 rounded-2xl flex-row justify-center items-center border border-red-100 dark:border-red-900/20"
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color={Colors.palette.error}
        />
        <Text className="ml-2 text-red-500 font-bold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
