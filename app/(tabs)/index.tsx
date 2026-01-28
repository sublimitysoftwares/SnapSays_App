import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoClipboard from "expo-clipboard";
import * as ExpoHaptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip } from "react-native-paper";
import ImageUpload from "../../components/ImageUpload";
import SocialButtons from "../../components/SocialButtons";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { useAppTheme } from "../../context/ThemeContext";
import {
  GenerateCaptionResponse,
  useGenerateCaption,
} from "../../hooks/useGenerateCaption";
import "../global.css";

export default function Index() {
  const { user, isLoaded } = useUser();
  const { setIsSignedIn } = useAuth();
  const { signOut } = useClerkAuth();
  const { showSuccess, showError } = useNotification();
  const { isDark } = useAppTheme();

  interface CaptionData {
    caption: string;
    hashtags: string[];
  }

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<CaptionData[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { mutate: generateCaption, isPending: uploading } =
    useGenerateCaption();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setCaption(null);
      setSelectedImage(null);
      setRefreshing(false);
    }, 1500);
  }, []);

  const processCaptionData = (captionData: any) => {
    try {
      if (typeof captionData === "string") {
        // More robust extraction of JSON from markdown blocks
        const jsonMatch = captionData.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleaned = jsonMatch ? jsonMatch[1].trim() : captionData.trim();
        const parsed = JSON.parse(cleaned);

        const normalized = (Array.isArray(parsed) ? parsed : [parsed]).map(
          (item: any) => ({
            caption: item.caption || item.post || "",
            hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
          }),
        );

        setCaption(normalized);
      } else {
        const rawData = Array.isArray(captionData)
          ? captionData
          : [captionData];
        const normalized = rawData.map((item: any) => ({
          caption: item.caption || item.post || "",
          hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
        }));
        setCaption(normalized);
      }
    } catch (e) {
      console.error("Failed to parse caption JSON", e);
      setCaption([
        {
          caption: typeof captionData === "string" ? captionData : "",
          hashtags: [],
        },
      ]);
    }
  };

  const handleCopy = async (text: string, hashtags: string[]) => {
    const fullText = `${text}\n\n${hashtags.map((tag) => `#${tag}`).join(" ")}`;
    await ExpoClipboard.setStringAsync(fullText);
    await ExpoHaptics.notificationAsync(
      ExpoHaptics.NotificationFeedbackType.Success,
    );
    showSuccess("Copied to clipboard!");
  };

  const handleUpload = (description: string) => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }
    console.log(selectedImage, description);

    generateCaption(
      { selectedImage, description },
      {
        onSuccess: (data: GenerateCaptionResponse) => {
          console.log({ data });
          processCaptionData(data.caption || "");
          showSuccess("Caption generated successfully!");
          // setSelectedImage(null);
        },
        onError: (err: Error) => {
          const message = err.message || "Upload failed";
          showError(message);
        },
      },
    );
  };

  const shareToLinkedIn = () => {
    const description = `You are a professional LinkedIn copywriter and personal brand strategist. Given an image of a person, first analyze the facial expression and overall face sentiment (for example: calm, confident, thoughtful, playful, intense). Use this emotional insight internally to guide tone, word choice, and message alignment. Generate exactly 4 LinkedIn posts aligned with their visual presence, professional personality profile, and emotional state. Each post must be ready to publish, vary in tone, and include relevant hashtags. Do not mention the personality summary, the facial analysis, or the image description directly. Return the response as a JSON array of 4 objects, each with 'post' and 'hashtags' keys.`;
    handleUpload(description);
  };

  const shareToInstagram = () => {
    const description = `You are a professional Instagram copywriter and personal brand strategist. Given an image of a person, first analyze the facial expression and overall face sentiment (for example: calm, confident, thoughtful, playful, intense). Use this emotional insight internally to guide tone, word choice, and message alignment. Generate exactly 4 Instagram captions aligned with their visual presence, personality profile, and emotional state. Each caption must be ready to post, vary in tone, and include suitable hashtags. Do not mention the personality summary, the facial analysis, or the image description directly. Return the response as a JSON array of 4 objects, each with 'caption' and 'hashtags' keys.`;
    handleUpload(description);
  };

  if (!isLoaded) return null;

  return (
    <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
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
        <View className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-4 flex-row items-center overflow-hidden relative my-6 shadow-md shadow-indigo-100 dark:shadow-none">
          <View className="flex-1 z-10">
            <Text className="text-white text-lg font-bold mb-1">
              Snap, Say, Share
            </Text>
            <Text className="text-indigo-100 text-[11px] font-medium leading-4">
              AI-powered captions for your best social media moments.
            </Text>
          </View>
          <View className="absolute -right-2 -bottom-2 opacity-20">
            <Ionicons
              name="sparkles"
              size={80}
              color={isDark ? Colors.dark.tint : Colors.palette.white}
            />
          </View>
        </View>

        <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
          <ImageUpload
            selectedImage={selectedImage}
            onImageSelected={setSelectedImage}
          />

          {selectedImage && !uploading && (
            <View className="mt-6">
              <Text className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                Select any one of the following options to generate text for
                your image
              </Text>
              <SocialButtons
                shareToLinkedIn={shareToLinkedIn}
                shareToInstagram={shareToInstagram}
              />
            </View>
          )}

          {uploading && (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator
                size="large"
                color={isDark ? Colors.dark.tint : Colors.light.tint}
              />
              <Text className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold text-center">
                Generating your social content...
              </Text>
            </View>
          )}
        </View>

        {caption &&
          caption.map((item, index) => (
            <View
              key={index}
              className="mb-8 bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-gray-50 dark:border-slate-800"
            >
              <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl items-center justify-center mr-3 border border-indigo-100 dark:border-indigo-800">
                    <Ionicons
                      name="sparkles"
                      size={18}
                      color={isDark ? Colors.dark.tint : Colors.light.secondary}
                    />
                  </View>
                  <Text className="text-lg font-black text-gray-800 dark:text-white">
                    Magic Caption
                  </Text>
                </View>
                <View className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                  <Text className="text-green-700 dark:text-green-400 text-[9px] font-black uppercase">
                    Success
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 mb-4">
                <Text className="text-gray-800 dark:text-slate-200 text-md leading-6 font-semibold italic">
                  "{item.caption}"
                </Text>

                {item.hashtags && item.hashtags.length > 0 && (
                  <View className="flex-row flex-wrap mt-4 gap-2">
                    {item.hashtags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        mode="flat"
                        selectedColor={
                          isDark ? Colors.dark.tint : Colors.light.secondary
                        }
                        style={{
                          backgroundColor: isDark
                            ? Colors.dark.surface
                            : Colors.palette.white,
                          borderWidth: 1,
                          borderColor: isDark
                            ? Colors.dark.outline
                            : Colors.palette.indigo[50],
                          height: 30,
                        }}
                        textStyle={{ fontWeight: "700", fontSize: 11 }}
                      >
                        #{tag.toLowerCase()}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>

              <View className="flex-row justify-between items-center px-1">
                <View className="flex-row items-center">
                  <Ionicons
                    name="heart"
                    size={16}
                    color={Colors.palette.error}
                  />
                  <Text className="ml-1.5 text-gray-400 dark:text-gray-500 font-bold text-[10px]">
                    AI Generated
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleCopy(item.caption, item.hashtags)}
                  className="flex-row items-center bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-700"
                >
                  <Ionicons
                    name="copy-outline"
                    size={14}
                    color={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <Text className="ml-1.5 text-gray-500 dark:text-slate-400 font-bold text-[10px]">
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
