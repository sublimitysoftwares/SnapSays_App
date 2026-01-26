import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { Chip, SegmentedButtons } from "react-native-paper";
import ImageUpload from "../../components/ImageUpload";
import { useAuth } from "../../context/AuthContext";
import "../global.css";

export default function Index() {
  const { user } = useUser();
  const { setIsSignedIn } = useAuth();
  const { signOut } = useClerkAuth();
  interface CaptionData {
    caption: string;
    hashtags: string[];
  }

  const [caption, setCaption] = useState<CaptionData[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"caption" | "bgRemove">("caption");
  const pagerRef = useRef<PagerView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request or any refresh logic
    setTimeout(() => {
      setCaption(null); // Clear the caption on refresh
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleUploadSuccess = (data: string) => {
    console.log("Image uploaded successfully:", data);
    processCaptionData(data);
  };

  const processCaptionData = (captionData: any) => {
    try {
      if (typeof captionData === "string") {
        const cleaned = captionData.replace(/```json\n?|\n?```/g, "").trim();
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

        setRefreshing(false);
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

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50/50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
      >
        {/* Header Section */}
        <View className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
                Welcome back,
              </Text>
              <Text className="text-2xl font-black text-gray-800">
                {user?.firstName || "Explorer"} 👋
              </Text>
            </View>
            <TouchableOpacity className="p-1 bg-indigo-50 rounded-full border border-indigo-100">
              <Image
                source={{ uri: user?.imageUrl }}
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
          </View>

          <View className="bg-indigo-600 rounded-3xl p-6 flex-row items-center overflow-hidden relative">
            <View className="flex-1 z-10">
              <Text className="text-white text-xl font-bold mb-1">
                Snap, Say, Share
              </Text>
              <Text className="text-indigo-100 text-sm font-medium leading-5">
                Generate perfect captions for your social media in seconds.
              </Text>
            </View>
            <View className="absolute -right-4 -bottom-4 opacity-20">
              <Ionicons name="sparkles" size={100} color="white" />
            </View>
          </View>
        </View>

        <View className="p-6">
          {/* Tabs Section using React Native Paper */}
          <View className="mb-8">
            <SegmentedButtons
              value={activeTab}
              onValueChange={(value) => {
                const tab = value as "caption" | "bgRemove";
                setActiveTab(tab);
                pagerRef.current?.setPage(tab === "caption" ? 0 : 1);
              }}
              density="medium"
              theme={{
                colors: {
                  secondaryContainer: "#4f46e5", // bg-indigo-600
                  onSecondaryContainer: "white",
                  outline: "#e2e8f0", // gray-200
                },
              }}
              buttons={[
                {
                  value: "caption",
                  label: "Caption",
                  icon: "text",
                  showSelectedCheck: true,
                  style: {
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    padding: 8,
                  },
                },
                {
                  value: "bgRemove",
                  label: "Remove BG",
                  icon: "image-outline",
                  showSelectedCheck: true,
                  style: {
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    padding: 8,
                  },
                },
              ]}
            />
          </View>

          {/* Section Title */}
          <View className="flex-row items-center mb-6">
            <View className="w-1 h-6 bg-indigo-600 rounded-full mr-3" />
            <Text className="text-xl font-black text-gray-800">
              {activeTab === "caption" ? "Magic Caption" : "Background Remover"}
            </Text>
          </View>

          <PagerView
            ref={pagerRef}
            className="flex-1"
            initialPage={0}
            onPageSelected={(e) => {
              const index = e.nativeEvent.position;
              setActiveTab(index === 0 ? "caption" : "bgRemove");
            }}
            style={{ height: caption ? 600 : 400 }} // Adjusting height based on content
          >
            {/* Caption Tab Content */}
            <View key="1" className="px-1">
              {/* Image Upload Component */}
              <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                <ImageUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              </View>

              {/* Uploaded Image URL Display */}
              {caption &&
                Array.isArray(caption) &&
                caption.map((item: any, index: number) => (
                  <View
                    key={index}
                    className="mt-8 bg-white rounded-[32px] p-6 shadow-sm border border-gray-100"
                  >
                    <View className="flex-row items-center justify-between mb-5">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-3 border border-indigo-100">
                          <Ionicons name="sparkles" size={20} color="#6366f1" />
                        </View>
                        <Text className="text-xl font-black text-gray-800">
                          Magic Caption
                        </Text>
                      </View>
                      <View className="bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                        <Text className="text-green-700 text-[10px] font-black uppercase tracking-wider">
                          Success
                        </Text>
                      </View>
                    </View>

                    <View className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 mb-4">
                      <Text className="text-gray-800 text-lg leading-7 font-semibold italic">
                        "{item.caption}"
                      </Text>

                      {item.hashtags && item.hashtags.length > 0 && (
                        <View className="flex-row flex-wrap mt-4 gap-2">
                          {item.hashtags.map((tag: string, idx: number) => (
                            <Chip
                              key={idx}
                              mode="flat"
                              selectedColor="#6366f1"
                              style={{
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: "#eef2ff",
                                height: 32,
                              }}
                              textStyle={{
                                fontWeight: "700",
                                fontSize: 12,
                                color: "#6366f1",
                              }}
                            >
                              #{tag.toLowerCase()}
                            </Chip>
                          ))}
                        </View>
                      )}
                    </View>

                    <View className="flex-row justify-between items-center px-1">
                      <View className="flex-row items-center">
                        <Ionicons name="heart" size={18} color="#f43f5e" />
                        <Text className="ml-1.5 text-gray-400 font-bold text-xs">
                          AI Generated
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">
                          SNAPSAYS AI
                        </Text>
                        <View className="ml-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      </View>
                    </View>
                  </View>
                ))}
            </View>

            {/* Remove BG Tab Content */}
            <View key="2" className="px-1">
              <View className="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100 items-center justify-center min-h-[300px]">
                <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-6 border border-indigo-100">
                  <Ionicons name="image-outline" size={40} color="#6366f1" />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-2">
                  Coming Soon
                </Text>
                <Text className="text-gray-500 text-center leading-5 px-4">
                  Remove backgrounds from your images with professional quality
                  in one tap.
                </Text>
              </View>
            </View>
          </PagerView>
        </View>
      </ScrollView>
    </View>
  );
}
