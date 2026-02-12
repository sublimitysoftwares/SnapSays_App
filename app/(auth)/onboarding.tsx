import { useNotification } from "@/context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PAGES } from "../../constants/questions";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Turn Photos into\nViral Content with AI",
    description:
      "Generate high-engagement captions and stunning backgrounds in seconds.",
    iconName: "color-wand" as const,
    imageColor: "#4f46e5",
  },
  {
    id: "2",
    title: "Smart Captions &\nTrending Hashtags",
    description:
      "Our AI analyzes your photos to generate the perfect voice and the most relevant tags to boost your reach.",
    iconName: "chatbubbles" as const,
    imageColor: "#818cf8",
  },
  {
    id: "3",
    title: "Change Any Background\nUsing Simple Prompts",
    description:
      "Type what you want to see and let our AI do the rest. Perfect for high-quality social media posts.",
    iconName: "image" as const,
    imageColor: "#6366f1",
  },
];

export default function OnboardingScreen() {
  // Slider State
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Question State
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);

  // Shared State
  const [loading, setLoading] = useState(false);

  const {
    setIsOnboarded,
    setIsSignedIn,
    setUser,
    pendingUser,
    setPendingUser,
  } = useAuth();
  const router = useRouter();
  const { showSuccess } = useNotification();

  const currentPage = PAGES[currentPageIndex];

  // --- Slider Handlers ---

  const handleSliderNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowQuestions(true);
    }
  };

  const handleSkipSlides = () => {
    setShowQuestions(true);
  };

  // --- Question Handlers ---

  const handleSelectOption = (questionField: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionField]: value,
    }));
  };

  const getSelectedLabel = (field: string, value: string) => {
    for (const page of PAGES) {
      const question = page.questions.find((q) => q.field === field);
      if (question) {
        const option = question.options.find((opt) => opt.value === value);
        return option ? option.label : value;
      }
    }
    return value;
  };

  const handleQuestionNext = () => {
    const allAnswered = currentPage.questions.every((q) => answers[q.field]);
    if (!allAnswered) {
      Alert.alert(
        "Please answer all questions before moving to the next page.",
      );
      return;
    }

    if (currentPageIndex < PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleQuestionBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    } else {
      // Go back to slides
      setShowQuestions(false);
    }
  };

  const handleFinish = async () => {
    if (!pendingUser) {
      // Fallback for testing/direct access without signup flow
      setIsOnboarded(true);
      router.replace("/(tabs)");
      return;
    }

    setLoading(true);
    try {
      // Map answers to required API format
      const formattedAnswers = PAGES.flatMap((page) =>
        page.questions.map((q) => {
          const selectedValue = answers[q.field];
          // Default to first option if somehow undefined
          const fallbackOption = q.options[0];
          const selectedOption =
            q.options.find((opt) => opt.value === selectedValue) ||
            fallbackOption;

          return {
            questionId: q.numericId,
            optionId: selectedOption.optionId,
          };
        }),
      );

      const payload = {
        username: pendingUser.username,
        password: pendingUser.password,
        answers: formattedAnswers,
      };

      const apiUrl =
        "http://fapindetails.sublimitysoft.com/api/api//Common/SaveUser";
      const response = await axios.post(apiUrl, payload);
      const result = response.data;

      if (result.ResponseCode === 200) {
        showSuccess("Profile created successfully!");

        await setIsOnboarded(true);
        await setUser(result.Data || { username: pendingUser.username });
        await setIsSignedIn(true);
        setPendingUser(null);

        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Setup Failed",
          result.ResponseMessage || "Something went wrong.",
        );
      }
    } catch (error: any) {
      console.error("Signup API error:", error);
      Alert.alert("Error", "Failed to setup your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renders ---

  const renderSlideItem = ({ item }: { item: (typeof SLIDES)[0] }) => {
    return (
      <View style={{ width, alignItems: "center", padding: 20 }}>
        <View className="w-full h-[60%] items-center justify-center mb-8 bg-white/5 rounded-[40px] border border-white/10 overflow-hidden relative">
          <View className="absolute inset-0 bg-indigo-500/10 rounded-[40px]" />
          <View className="w-32 h-32 rounded-full bg-indigo-500/20 items-center justify-center mb-4 border border-indigo-400/30">
            <Ionicons name={item.iconName} size={64} color="#818cf8" />
          </View>
          <View className="absolute top-10 right-10 w-16 h-16 bg-blue-500/20 rounded-2xl rotate-12" />
          <View className="absolute bottom-20 left-10 w-10 h-10 bg-purple-500/20 rounded-full" />
        </View>

        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          className="items-center"
        >
          <Text className="text-white text-3xl font-black text-center mb-4 leading-tight">
            {item.title}
          </Text>
          <Text className="text-white/60 text-base text-center font-medium leading-6 px-4">
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const progress = showSummary ? 1 : (currentPageIndex + 1) / PAGES.length;

  return (
    <LinearGradient colors={["#1e1b4b", "#020617"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View className="flex-1">
          {!showQuestions ? (
            // --- SLIDER VIEW ---
            <>
              <View className="flex-row justify-end px-6 pt-2">
                <TouchableOpacity onPress={handleSkipSlides}>
                  <Text className="text-white/60 font-bold text-sm">Skip</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlideItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                  const contentOffsetX = e.nativeEvent.contentOffset.x;
                  const index = Math.round(contentOffsetX / width);
                  setCurrentIndex(index);
                }}
              />

              <View className="flex-row justify-center gap-2 mb-8">
                {SLIDES.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-8 bg-[#2563EB]"
                        : "w-2 bg-slate-800"
                    }`}
                  />
                ))}
              </View>

              <View className="px-6 pb-8">
                <TouchableOpacity
                  onPress={handleSliderNext}
                  className="w-full bg-[#2563EB] h-14 rounded-full items-center justify-center shadow-lg shadow-blue-900/50 flex-row"
                >
                  <Text className="text-white text-lg font-bold mr-2">
                    {currentIndex === SLIDES.length - 1
                      ? "Get Started"
                      : "Continue"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // --- QUESTIONNAIRE VIEW ---
            <View className="flex-1 px-6 py-4">
              <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={handleQuestionBack}
                    className="p-2 rounded-full bg-white/10"
                  >
                    <Ionicons name="chevron-back" size={24} color="white" />
                  </TouchableOpacity>

                  {(showSummary || Object.keys(answers).length > 0) &&
                    !loading && (
                      <TouchableOpacity
                        onPress={() => {
                          setShowSummary(false);
                          setCurrentPageIndex(0);
                          setAnswers({});
                        }}
                        className="ml-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-400/30 flex-row items-center"
                      >
                        <Ionicons name="refresh" size={14} color="#f87171" />
                      </TouchableOpacity>
                    )}
                </View>

                <View className="flex-1 mx-4">
                  <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <Animated.View
                      className="h-full bg-[#2563EB]"
                      style={{ width: `${progress * 100}%` }}
                      layout={Layout.springify()}
                    />
                  </View>
                </View>

                <Text className="text-white/60 font-medium">
                  {showSummary
                    ? "Done"
                    : `${currentPageIndex + 1}/${PAGES.length}`}
                </Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
              >
                {showSummary ? (
                  <Animated.View
                    entering={FadeInRight.duration(400)}
                    key="summary"
                  >
                    <Text className="text-white/60 text-lg mb-2">
                      Summary review ✨
                    </Text>
                    <Text className="text-white text-3xl font-black mb-8">
                      Your Profile
                    </Text>

                    {PAGES.flatMap((p) => p.questions).map((q, idx) => (
                      <View
                        key={q.id}
                        className="mb-4 bg-slate-900/50 p-5 rounded-[32px] border border-white/10"
                      >
                        <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                          Question {idx + 1}
                        </Text>
                        <Text className="text-white text-lg font-bold mb-3">
                          {q.question}
                        </Text>
                        <View className="bg-blue-500/10 px-4 py-3 rounded-2xl border border-blue-500/20 flex-row items-center">
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#3b82f6"
                            className="mr-2"
                          />
                          <Text className="text-blue-100 font-medium ml-2">
                            {getSelectedLabel(q.field, answers[q.field])}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Animated.View>
                ) : (
                  <Animated.View
                    key={currentPageIndex}
                    entering={FadeInRight.duration(400).delay(100)}
                    exiting={FadeOutLeft.duration(400)}
                  >
                    <Text className="text-white/60 text-lg mb-2">
                      {currentPage.helperText}
                    </Text>
                    <Text className="text-white text-3xl font-black mb-10">
                      Let's get to know you
                    </Text>

                    {currentPage.questions.map((q, i) => (
                      <View key={q.id} className="mb-10">
                        <View className="flex-row items-start mb-6">
                          <View className="bg-blue-500/20 px-3 py-1 rounded-full mr-3">
                            <Text className="text-blue-400 font-bold">
                              {currentPageIndex * 2 + i + 1}
                            </Text>
                          </View>
                          <Text className="text-white text-xl font-bold flex-1">
                            {q.question}
                          </Text>
                        </View>

                        <View className="space-y-4 gap-3">
                          {q.options.map((option) => {
                            const isSelected =
                              answers[q.field] === option.value;
                            return (
                              <TouchableOpacity
                                key={option.optionId}
                                onPress={() =>
                                  !loading &&
                                  handleSelectOption(q.field, option.value)
                                }
                                disabled={loading}
                                className={`p-5 rounded-3xl border-2 flex-row items-center justify-between ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-500"
                                    : "bg-white/5 border-white/10"
                                }`}
                              >
                                <Text
                                  className={`text-lg font-medium ${isSelected ? "text-white" : "text-slate-300"}`}
                                >
                                  {option.label}
                                </Text>
                                {isSelected && (
                                  <View className="bg-white/20 rounded-full p-1">
                                    <Ionicons
                                      name="checkmark"
                                      size={16}
                                      color="white"
                                    />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </Animated.View>
                )}
              </ScrollView>

              <View className="absolute bottom-10 left-6 right-6 flex-row gap-4">
                {showSummary && !loading && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowSummary(false);
                      setCurrentPageIndex(0);
                      setAnswers({});
                    }}
                    className="flex-1 bg-white/10 h-16 rounded-3xl items-center justify-center border border-white/10 flex-row"
                  >
                    <Ionicons
                      name="refresh"
                      size={20}
                      color="white"
                      className="mr-2"
                    />
                    <Text className="text-white text-lg font-bold ml-2">
                      Restart
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={showSummary ? handleFinish : handleQuestionNext}
                  disabled={loading}
                  className={`${showSummary ? "flex-1" : "w-full"} bg-white h-16 rounded-3xl items-center justify-center shadow-xl flex-row`}
                >
                  {loading ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <>
                      <Text className="text-slate-900 text-lg font-bold mr-2">
                        {showSummary
                          ? "All Set!"
                          : currentPageIndex === PAGES.length - 1
                            ? "Review"
                            : "Next"}
                      </Text>
                      <Ionicons
                        name={
                          showSummary
                            ? "rocket"
                            : currentPageIndex === PAGES.length - 1
                              ? "eye"
                              : "arrow-forward"
                        }
                        size={20}
                        color="#0f172a"
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
