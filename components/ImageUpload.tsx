import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GenerateCaptionResponse,
  useGenerateCaption,
} from "../hooks/useGenerateCaption";

interface ImageUploadProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  /* Removed local uploading state in favor of TanStack Query isPending */
  const [showOptions, setShowOptions] = useState(false);

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
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    },
    [requestPermission],
  );

  const { mutate: generateCaption, isPending: uploading } =
    useGenerateCaption();

  const handleUpload = useCallback(() => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    generateCaption(selectedImage, {
      onSuccess: (data: GenerateCaptionResponse) => {
        onUploadSuccess?.(data.caption || data.imageUrl || "");
        Alert.alert("Success", "Caption generated successfully");
        setSelectedImage(null);
      },
      onError: (err: Error) => {
        const message = err.message || "Upload failed";
        onUploadError?.(message);
        Alert.alert("Error", message);
      },
    });
  }, [selectedImage, generateCaption, onUploadSuccess, onUploadError]);

  return (
    <View className="w-full">
      {selectedImage && (
        <View className="mb-6 items-center">
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
              className="w-64 h-64 rounded-3xl"
            />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedImage ? (
        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading}
          className={`bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center ${
            uploading ? "opacity-50" : ""
          }`}
        >
          {uploading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text className="ml-2 text-white font-bold text-lg">
                Uploading…
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text className="ml-2 text-white font-bold text-lg">
                Upload Image
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setShowOptions(true)}
          className="bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center"
        >
          <Ionicons name="images-outline" size={24} color="white" />
          <Text className="ml-2 text-white font-bold text-lg">
            Select Image
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
          className="flex-1 bg-black/50 justify-end"
        >
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-center mb-6">
              Choose Image Source
            </Text>

            <TouchableOpacity
              onPress={() => selectImage("camera")}
              className="flex-row items-center bg-indigo-50 p-4 rounded-2xl mb-3"
            >
              <Ionicons name="camera" size={24} color="#4f46e5" />
              <Text className="ml-4 text-lg font-bold">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectImage("library")}
              className="flex-row items-center bg-indigo-50 p-4 rounded-2xl"
            >
              <Ionicons name="images" size={24} color="#4f46e5" />
              <Text className="ml-4 text-lg font-bold">Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
