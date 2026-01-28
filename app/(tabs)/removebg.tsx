import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageUpload from "../../components/ImageUpload";
import { Colors } from "../../constants/Colors";
import { API_CONFIG } from "../../constants/Config";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useAppTheme } from "../../context/ThemeContext";
import "../global.css";

export default function RemoveBgScreen() {
  const { user, isLoaded } = useUser();
  const { setIsSignedIn } = useAuth();
  const { signOut } = useClerkAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const { isDark } = useAppTheme();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bgDescription, setBgDescription] = useState("");
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setBgDescription("");
      setGeneratedImage(null);
      setRefreshing(false);
    }, 1000);
  }, []);

  const resizeAndCompressImage = async (uri: string) => {
    const { width, height } = await new Promise<{
      width: number;
      height: number;
    }>((resolve, reject) => {
      Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject);
    });

    let newWidth = width;
    let newHeight = height;

    if (width > 2048 || height > 2048) {
      const scale = Math.min(2048 / width, 2048 / height);
      newWidth = Math.floor(width * scale);
      newHeight = Math.floor(height * scale);
    }

    const result = await manipulateAsync(
      uri,
      [{ resize: { width: newWidth, height: newHeight } }],
      {
        compress: 0.7,
        format: SaveFormat.JPEG, // ✅ now defined
      },
    );

    return result.uri;
  };

  const addWatermark = async (imageUrl: string) => {
    return imageUrl;
  };

  const handleRemoveBg = async () => {
    if (!selectedImage) {
      showInfo("Please select an image first!");
      return;
    }
    if (!bgDescription.trim()) {
      showInfo("Please describe what to remove/change!");
      return;
    }

    const processedImage = await resizeAndCompressImage(selectedImage);

    try {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          Image.getSize(
            processedImage,
            (width, height) => resolve({ width, height }),
            (error) => reject(error),
          );
        },
      );

      if (dimensions.width > 2048 || dimensions.height > 2048) {
        Alert.alert(
          "Image Too Large",
          "The selected image exceeds 2048px. Please select a smaller image.",
        );
        return;
      }
    } catch (error) {
      console.log("Error checking image size:", error);
      // Optional: Proceed or return. Proceeding might result in API error.
    }

    setIsBgLoading(true);
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append("image_file", {
      uri: processedImage,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);
    formData.append("prompt", bgDescription.trim());

    try {
      const response = await axios.post(
        API_CONFIG.CLIPDROP_CONFIG.URL,
        formData,
        {
          headers: {
            "x-api-key": API_CONFIG.CLIPDROP_CONFIG.API_KEY,
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        },
      );

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );

      const fileName = `bg_removed_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const watermarkedImage = await addWatermark(fileUri);
      setGeneratedImage(watermarkedImage);
      showSuccess("Background replaced successfully! ✨");
    } catch (error: any) {
      console.error("Axios Error Details:", {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers,
            }
          : "No response",
      });
      showError(`Error: ${error.message}`);
    } finally {
      setIsBgLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant gallery permissions to save the image.",
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(generatedImage);
      showSuccess("Image saved to gallery! 📸");
    } catch (error) {
      console.error("Save Error:", error);
      showError("Failed to save image");
    }
  };

  if (!isLoaded) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1 }}
      className="bg-white dark:bg-slate-950"
    >
      <View className="bg-white dark:bg-slate-950 px-6 pt-14 pb-4 border-b border-gray-50 dark:border-slate-900 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">
            Welcome back,
          </Text>
          <Text className="text-xl font-black text-gray-800 dark:text-white">
            {user?.firstName || "Explorer"} 👋
          </Text>
        </View>
        <TouchableOpacity className="p-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-800">
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6 bg-gray-50/30 dark:bg-slate-950"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
            tintColor="#4f46e5"
          />
        }
      >
        <View className="bg-purple-600 dark:bg-purple-700 rounded-2xl p-4 flex-row items-center overflow-hidden relative my-6 shadow-md shadow-purple-100 dark:shadow-none">
          <View className="flex-1 z-10">
            <Text className="text-white text-lg font-bold mb-1">
              Background Magic
            </Text>
            <Text className="text-purple-100 text-[11px] font-medium leading-4">
              AI-powered tools to replace or remove image backgrounds instantly.
            </Text>
          </View>
          <View className="absolute -right-2 -bottom-2 opacity-20">
            <Ionicons
              name="color-wand"
              size={80}
              color={isDark ? Colors.dark.tint : Colors.palette.white}
            />
          </View>
        </View>

        <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
          <ImageUpload
            selectedImage={selectedImage}
            onImageSelected={(uri) => {
              setSelectedImage(uri);
              setGeneratedImage(null);
            }}
          />

          {selectedImage && (
            <View className="mt-6">
              <Text className="text-gray-600 dark:text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
                Describe new background
              </Text>
              <TextInput
                value={bgDescription}
                onChangeText={setBgDescription}
                placeholder="e.g., a luxury office with city view"
                placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-gray-800 dark:text-white border border-gray-100 dark:border-slate-700 mb-4"
                multiline
              />

              <TouchableOpacity
                onPress={handleRemoveBg}
                disabled={isBgLoading}
                className={`py-4 rounded-xl flex-row justify-center items-center ${isBgLoading ? "bg-gray-300 dark:bg-slate-800" : "bg-indigo-600 shadow-md"}`}
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
          )}
        </View>

        {generatedImage && (
          <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-9 h-9 bg-green-50 dark:bg-green-900/20 rounded-xl items-center justify-center mr-3 border border-green-100 dark:border-green-800">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={isDark ? "#4ade80" : "#16a34a"}
                  />
                </View>
                <Text className="text-lg font-black text-gray-800 dark:text-white">
                  Result ✨
                </Text>
              </View>
            </View>
            <Image
              source={{ uri: generatedImage }}
              className="w-full h-80 rounded-2xl mb-4"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={handleDownload}
              className="bg-green-600 py-4 rounded-xl flex-row justify-center items-center shadow-md"
            >
              <Ionicons name="download-outline" size={20} color="white" />
              <Text className="ml-2 text-white font-bold text-lg">
                Save to Gallery
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
