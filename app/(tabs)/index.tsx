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
import BgRemove from "../../components/BgRemove";
import ImageUpload from "../../components/ImageUpload";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";
import "../global.css";

export default function Index() {
  const { user, isLoaded } = useUser();
  const { setIsSignedIn } = useAuth();
  const { signOut } = useClerkAuth();

  if (!isLoaded) return null;
  interface CaptionData {
    caption: string;
    hashtags: string[];
  }

  const [caption, setCaption] = useState<CaptionData[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"caption" | "bgRemove">("caption");
  const pagerRef = useRef<PagerView>(null);
  const { isDark } = useAppTheme();

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
    <View style={{ flex: 1 }} className="bg-white dark:bg-slate-950">
      {/* 1. Sticky Header Section (Non-Scrollable) */}
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

      {/* 2. Tabs Section (Sticky below Header) */}
      <View className="px-6 py-4 bg-white dark:bg-slate-950 shadow-sm z-10">
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
              secondaryContainer: isDark ? Colors.dark.tint : Colors.light.tint,
              onSecondaryContainer: Colors.palette.white,
              outline: isDark ? Colors.dark.outline : Colors.light.outline,
            },
          }}
          buttons={[
            {
              value: "caption",
              label: "Caption",
              icon: "text",
              style: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
            },
            {
              value: "bgRemove",
              label: "Remove BG",
              icon: "image-outline",
              style: { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
            },
          ]}
        />
      </View>

      {/* 3. PagerView takes up the remaining screen space (flex: 1) */}
      <View style={{ flex: 1 }}>
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position;
            setActiveTab(index === 0 ? "caption" : "bgRemove");
          }}
        >
          {/* Caption Tab Slidable Content */}
          <View
            key="1"
            style={{ flex: 1 }}
            className="bg-gray-50/30 dark:bg-slate-950"
          >
            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 0 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#4f46e5"]}
                  tintColor="#4f46e5"
                />
              }
            >
              {/* Promo Banner moved inside ScrollView for better scroll flow */}
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

              {/* Upload Area */}
              <View className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
                <ImageUpload
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />
              </View>

              {/* Caption Results */}
              {caption &&
                caption.map((item: any, index: number) => (
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
                            color={
                              isDark ? Colors.dark.tint : Colors.light.secondary
                            }
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
                          {item.hashtags.map((tag: string, idx: number) => (
                            <Chip
                              key={idx}
                              mode="flat"
                              selectedColor={
                                isDark
                                  ? Colors.dark.tint
                                  : Colors.light.secondary
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
                    </View>
                  </View>
                ))}

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>

          {/* Remove BG Tab Slidable Content */}
          <View
            key="2"
            style={{ flex: 1 }}
            className="bg-gray-50/30 dark:bg-slate-950"
          >
            <BgRemove />
          </View>
        </PagerView>
      </View>
    </View>
  );
}
