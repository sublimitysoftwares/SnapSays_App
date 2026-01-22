import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface ImageUploadProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const requestPermission = useCallback(
    async (type: 'camera' | 'library') => {
      const permission =
        type === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          type === 'camera'
            ? 'Camera access is required.'
            : 'Photo library access is required.'
        );
        return false;
      }

      return true;
    },
    []
  );

  const selectImage = useCallback(
    async (source: 'camera' | 'library') => {
      setShowOptions(false);

      const hasPermission = await requestPermission(source);
      if (!hasPermission) return;

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    },
    [requestPermission]
  );

  const uploadImage = useCallback(async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setUploading(true);

    try {
      const fileInfo = await FileSystem.getInfoAsync(selectedImage);
      if (!fileInfo.exists) throw new Error('File not found');

      const filename = selectedImage.split('/').pop() ?? 'image.jpg';
      const ext = filename.split('.').pop() ?? 'jpg';

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        name: filename,
        type: `image/${ext}`,
      } as any);

      const response = await fetch(
        'https://your-backend.com/api/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const data = await response.json();

      onUploadSuccess?.(data.imageUrl);
      Alert.alert('Success', 'Image uploaded successfully');
      setSelectedImage(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Upload failed';
      onUploadError?.(message);
      Alert.alert('Error', message);
    } finally {
      setUploading(false);
    }
  }, [selectedImage, onUploadSuccess, onUploadError]);

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
          onPress={uploadImage}
          disabled={uploading}
          className={`bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center ${
            uploading ? 'opacity-50' : ''
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
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color="white"
              />
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
              onPress={() => selectImage('camera')}
              className="flex-row items-center bg-indigo-50 p-4 rounded-2xl mb-3"
            >
              <Ionicons name="camera" size={24} color="#4f46e5" />
              <Text className="ml-4 text-lg font-bold">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectImage('library')}
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
