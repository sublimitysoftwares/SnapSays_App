import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-paper";
import { Colors } from "../../constants/Colors";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";

const Profile = () => {
  const { user, logout } = useAuthContext();
  const { isDark, toggleTheme } = useAppTheme();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-950">
      {/* Header / Background Shape */}
      <View className="bg-indigo-600 h-48 rounded-b-[40px] items-center justify-center relative shadow-lg">
        <View className="absolute -bottom-16 items-center">
          <View className="p-1 bg-white dark:bg-slate-800 rounded-full shadow-xl">
            <View className="w-32 h-32 rounded-full bg-indigo-100 items-center justify-center">
              <Ionicons name="person" size={64} color="#4f46e5" />
            </View>
          </View>
        </View>
      </View>

      {/* User Info Section */}
      <View className="mt-20 px-6 items-center">
        <Text className="text-2xl font-black text-gray-800 dark:text-white">
          {user.username || "User"}
        </Text>
        <Text className="text-gray-500 font-medium mt-1 dark:text-gray-400">
          {user.email || "No email provided"}
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

      {/* Personality Details Section */}
      <View className="mt-10 px-6">
        <View className="flex-row items-center mb-4">
          <Text className="text-xl font-black text-gray-800 dark:text-white">
            Personality Profile
          </Text>
          <View className="ml-2 w-8 h-[2px] bg-indigo-500" />
        </View>

        {user.User_Personality_Details &&
        user.User_Personality_Details.length > 0 ? (
          user.User_Personality_Details.map((detail: any, index: number) => (
            <View
              key={index}
              className="bg-white dark:bg-slate-900 p-5 rounded-[28px] mb-4 shadow-sm border border-gray-100 dark:border-slate-800"
            >
              <View className="flex-row items-center mb-2">
                <View className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center mr-2">
                  <Text className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    {index + 1}
                  </Text>
                </View>
                <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  Question
                </Text>
              </View>

              <Text className="text-gray-800 dark:text-white font-bold text-sm mb-3">
                {detail.Question}
              </Text>

              <View className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#4f46e5" />
                <Text className="text-indigo-700 dark:text-indigo-300 font-semibold ml-2 text-xs">
                  {detail.Answer}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white dark:bg-slate-900 p-6 rounded-[28px] items-center border border-dashed border-gray-200 dark:border-slate-800">
            <Ionicons
              name="information-circle-outline"
              size={32}
              color="#94a3b8"
            />
            <Text className="text-gray-400 dark:text-gray-500 text-center mt-2 font-medium">
              No personality details found.
            </Text>
          </View>
        )}
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
