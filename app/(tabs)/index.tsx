import { useUser, useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { Text, View, Button, ScrollView } from "react-native";
import "../global.css";
import { router } from "expo-router";
import ImageUpload from "../../components/ImageUpload";
import { useState } from "react";

export default function Index() {
  const { user } = useUser();
  const { getToken, userId, signOut } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleUploadSuccess = (imageUrl: string) => {
    console.log('Image uploaded successfully:', imageUrl);
    setUploadedImageUrl(imageUrl);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-black text-gray-800 mb-2">
            Upload Image
          </Text>
          <Text className="text-gray-500 text-base">
            Take a photo or choose from your gallery
          </Text>
        </View>

        {/* User Info Card */}
        {user && (
          <View className="bg-indigo-50 p-4 rounded-2xl mb-6">
            <Text className="text-sm text-gray-500 mb-2">Logged in as</Text>
            <Text className="text-lg font-bold text-gray-800">
              {user.firstName || user.primaryEmailAddress?.emailAddress}
            </Text>
            <Text className="text-sm text-gray-600">{user.primaryEmailAddress?.emailAddress}</Text>
          </View>
        )}

        {/* Image Upload Component */}
        <ImageUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Uploaded Image URL Display */}
        {uploadedImageUrl && (
          <View className="mt-6 bg-green-50 p-4 rounded-2xl">
            <Text className="text-green-800 font-bold mb-2">✓ Upload Successful!</Text>
            <Text className="text-green-700 text-sm">Image URL: {uploadedImageUrl}</Text>
          </View>
        )}

        {/* Sign Out Button */}
        <View className="mt-8">
          <Button
            title="Sign Out"
            onPress={async () => {
              await signOut();
              // Auth guard will automatically redirect to login
            }}
            color="#ef4444"
          />
        </View>
      </View>
    </ScrollView>
  );
}
