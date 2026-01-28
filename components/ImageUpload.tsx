import { Ionicons } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useAppTheme } from "../context/ThemeContext";

interface ImageUploadProps {
  onImageSelected: (uri: string | null) => void;
  selectedImage: string | null;
}

export default function ImageUpload({
  onImageSelected,
  selectedImage,
}: ImageUploadProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { isDark } = useAppTheme();

  const requestPermission = useCallback(async (type: "camera" | "library") => {
    const permission =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert(
        "Permission Required",
        `${type === "camera" ? "Camera" : "Photo library"} access is required to select images. Please enable it in settings.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    return true;
  }, []);

  const selectImage = useCallback(
    async (source: "camera" | "library") => {
      setShowOptions(false);

      const hasPermission = await requestPermission(source);
      if (!hasPermission) return;

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.5,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.5,
            });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        let finalUri = asset.uri;

        if (asset.width > 2048 || asset.height > 2048) {
          try {
            const manipResult = await manipulateAsync(
              asset.uri,
              [
                {
                  resize:
                    asset.width > asset.height
                      ? { width: 2048 }
                      : { height: 2048 },
                },
              ],
              { compress: 0.8, format: SaveFormat.JPEG },
            );
            finalUri = manipResult.uri;
          } catch (error) {
            console.error("Resize error:", error);
            // Fallback or alert? Proceeding with original might limit API
          }
        }
        onImageSelected(finalUri);
      }
    },
    [requestPermission, onImageSelected],
  );

  return (
    <View className="w-full">
      {selectedImage ? (
        <View className="items-center w-full">
          <View className="relative w-full">
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-80 rounded-3xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onImageSelected(null)}
              className="absolute top-3 right-3 bg-red-500 p-2 rounded-full shadow-lg"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowOptions(true)}
          className="bg-indigo-50 dark:bg-indigo-900/10 py-12 rounded-[32px] border-2 border-dashed border-indigo-200 dark:border-indigo-800 flex-column justify-center items-center"
        >
          <View className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
            <Ionicons
              name="images-outline"
              size={32}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
            />
          </View>
          <Text className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
            Select an Image
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Pick from gallery or take a photo
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6">
            <View className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full self-center mb-6" />

            <Text className="text-xl font-bold text-center mb-8 dark:text-white">
              Choose Image Source
            </Text>

            <View className="flex-row justify-around mb-4">
              <TouchableOpacity
                onPress={() => selectImage("camera")}
                className="items-center"
              >
                <View className="bg-indigo-50 dark:bg-indigo-900/20 w-16 h-16 rounded-2xl items-center justify-center mb-2">
                  <Ionicons
                    name="camera"
                    size={28}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                  />
                </View>
                <Text className="font-bold dark:text-slate-300">Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => selectImage("library")}
                className="items-center"
              >
                <View className="bg-purple-50 dark:bg-purple-900/20 w-16 h-16 rounded-2xl items-center justify-center mb-2">
                  <Ionicons
                    name="images"
                    size={28}
                    color={isDark ? "#a78bfa" : "#9333ea"}
                  />
                </View>
                <Text className="font-bold dark:text-slate-300">Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
