import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { API_CONFIG } from "../constants/Config";
import { useNotification } from "../context/NotificationContext";
import { useAppTheme } from "../context/ThemeContext";

export default function BgRemove() {
  const [image, setImage] = useState<string | null>(null);
  const [bgDescription, setBgDescription] = useState("");
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { isDark } = useAppTheme();
  const { showSuccess, showError, showInfo } = useNotification();

  const selectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Photo library access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      setGeneratedImage(null);
    }
  };

  const addWatermark = async (imageUrl: string) => {
    // Basic placeholder for watermarking logic
    // In a real app, you might use expo-image-manipulator or a canvas-based solution
    return imageUrl;
  };

  const handleRemoveBg = async () => {
    if (!image) {
      showInfo("Please upload an image first!");
      return;
    }
    if (!bgDescription.trim()) {
      showInfo("Please describe what to remove/change!");
      return;
    }

    setIsBgLoading(true);
    setGeneratedImage(null);

    const formData = new FormData();
    // For React Native, we need to provide an object with uri, name, and type
    formData.append("image_file", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);
    formData.append("prompt", bgDescription.trim());

    try {
      const response = await fetch(API_CONFIG.CLIPDROP_CONFIG.URL, {
        method: "POST",
        headers: {
          "x-api-key": API_CONFIG.CLIPDROP_CONFIG.API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to replace background (${response.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {}

        throw new Error(errorMessage);
      }

      // Handle binary response in React Native
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );

      const fileName = `bg_removed_${Date.now()}.jpg`;
      const file = new FileSystem.File(FileSystem.Paths.document, fileName);

      await file.write(base64, {
        encoding: "base64",
      });

      // Add Watermark
      const watermarkedImage = await addWatermark(file.uri);

      setGeneratedImage(watermarkedImage);
      showSuccess("Background replaced successfully! ✨");
    } catch (error: any) {
      console.error(error);
      showError(`Error: ${error.message}`);
    } finally {
      setIsBgLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-6">
      <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
        <Text className="text-xl font-black text-gray-800 dark:text-white mb-4">
          Replace Background
        </Text>

        {!image ? (
          <TouchableOpacity
            onPress={selectImage}
            className="w-full h-48 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 items-center justify-center mb-4"
          >
            <Ionicons
              name="cloud-upload-outline"
              size={48}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
            />
            <Text className="mt-2 text-indigo-600 dark:text-indigo-400 font-bold">
              Select Image
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="relative mb-4">
            <Image
              source={{ uri: image }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-gray-600 dark:text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
            Describe new background
          </Text>
          <TextInput
            value={bgDescription}
            onChangeText={setBgDescription}
            placeholder="e.g., a luxury office with city view"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-800 dark:text-white border border-gray-100 dark:border-slate-700"
            multiline
          />
        </View>

        <TouchableOpacity
          onPress={handleRemoveBg}
          disabled={isBgLoading || !image}
          className={`py-4 rounded-xl flex-row justify-center items-center ${isBgLoading || !image ? "bg-gray-300 dark:bg-slate-800" : "bg-indigo-600 shadow-md"}`}
        >
          {isBgLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="color-wand" size={20} color="white" />
              <Text className="ml-2 text-white font-bold text-lg">
                Replace Background
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {generatedImage && (
        <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
          <Text className="text-lg font-black text-gray-800 dark:text-white mb-4">
            Result ✨
          </Text>
          <Image
            source={{ uri: generatedImage }}
            className="w-full h-64 rounded-2xl mb-4"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => Alert.alert("Download", "Feature coming soon!")}
            className="bg-green-600 py-3 rounded-xl flex-row justify-center items-center"
          >
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="ml-2 text-white font-bold">Save to Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
