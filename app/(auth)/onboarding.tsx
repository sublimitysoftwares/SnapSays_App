import { useNotification } from "@/context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";
import { PAGES } from "../../constants/questions";
import { useSummarizePersonality } from "../../hooks/useSummarizePersonality";
import { useAuth } from "../../context/AuthContext";
import SafeScreen from "../component/SafeScreen";
import { ActivityIndicator } from "react-native";
import { useRef } from "react";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const { setIsOnboarded, setAnswers: setContextAnswers, setPersonalitySummary, personalitySummary } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useNotification();

  const { mutate: summarize, isPending: isSummarizing } = useSummarizePersonality();

  const currentPage = PAGES[currentPageIndex];

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

  const handleNext = () => {
    // Check if all questions on current page are answered
    const allAnswered = currentPage.questions.every((q) => answers[q.field]);

    if (!allAnswered) {
      showError("Please answer all questions before moving to the next page.");
      return;
    }

    if (currentPageIndex < PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      const prompt = `You are a personality analyst. Based on the user's answers to these 10 questions, create a concise, friendly, and engaging one-sentence description of their personality. Also, provide 3 highly relevant and catchy hashtags.
      
      Important:
      - The sentence should be warm, relatable, and descriptive (max 20 words).
      - The hashtags should be modern and related to their vibe (e.g., #AdventurousSpirit, #QuietThinker, #LifeOfTheParty).
      - Format your response as a JSON object with 'summary' and 'hashtags' keys.`;

      summarize(
        { answers, prompt },
        {
          onSuccess: (data) => {
            console.log("Summarize success:", data);
            
            // Handle case where API might return empty or null data despite "success" status
            if (data && (data.summary || (data.hashtags && data.hashtags.length > 0))) {
              setPersonalitySummary({
                summary: data.summary || "You have a unique and interesting personality!",
                hashtags: data.hashtags || [],
              });
              showSuccess("Personality profile generated!");
            } else {
              console.warn("API returned success but missing data:", data);
              setPersonalitySummary(null);
              showInfo("Complete! Review your answers below.");
            }
            
            setContextAnswers(answers);
            setShowSummary(true);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          },
          onError: (err) => {
            console.error("Summarize error callback:", err);
            showError("We couldn't generate your personality summary, but you can still review your answers.");
            
            // Gracefully fallback to showing just the answers
            setPersonalitySummary(null);
            setContextAnswers(answers);
            setShowSummary(true);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          },
        }
      );
    }
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFinish = () => {
    console.log("Final Answers:", answers);
    setIsOnboarded(true);
    router.replace("/(tabs)");
  };

  const progress = showSummary ? 1 : (currentPageIndex + 1) / PAGES.length;

  return (
    <LinearGradient
      colors={["#4f46e5", "#312e81", "#1e1b4b"]}
      className="flex-1"
    >
      <SafeScreen>
        <View className="flex-1 px-6 py-4">
          {/* Header & Progress */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleBack}
                disabled={currentPageIndex === 0 && !showSummary}
                className={`p-2 rounded-full ${currentPageIndex === 0 && !showSummary ? "opacity-0" : "bg-white/10"}`}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>

              {(showSummary || Object.keys(answers).length > 0) && (
                <TouchableOpacity
                  onPress={() => {
                    setShowSummary(false);
                    setCurrentPageIndex(0);
                    setAnswers({});
                    setContextAnswers({});
                    setPersonalitySummary(null);
                  }}
                  className="ml-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-400/30 flex-row items-center"
                >
                  <Ionicons name="refresh" size={14} color="#f87171" />
                  <Text className="text-red-300 text-xs font-bold ml-1.5">
                    Reset
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-1 mx-4">
              <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                <Animated.View
                  className="h-full bg-indigo-400"
                  style={{ width: `${progress * 100}%` }}
                  layout={Layout.springify()}
                />
              </View>
            </View>

            <Text className="text-white/60 font-medium">
              {showSummary ? "Done" : `${currentPageIndex + 1}/${PAGES.length}`}
            </Text>
          </View>

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {showSummary ? (
              <Animated.View entering={FadeInRight.duration(400)} key="summary">
                <Text className="text-white/60 text-lg mb-2">
                  Summary review ✨
                </Text>
                <Text className="text-white text-3xl font-black mb-6">
                  Your Profile
                </Text>

                {personalitySummary && (
                  <View className="mb-8 bg-indigo-500/10 p-6 rounded-[32px] border border-indigo-400/20">
                    <View className="flex-row items-center mb-3">
                      <View className="w-8 h-8 bg-indigo-500 rounded-lg items-center justify-center mr-3">
                        <Ionicons name="sparkles" size={18} color="white" />
                      </View>
                      <Text className="text-indigo-200 text-sm font-bold uppercase tracking-wider">
                        AI Personality Insight
                      </Text>
                    </View>
                    
                    <Text className="text-white text-xl font-bold italic leading-7 mb-4">
                      "{personalitySummary.summary}"
                    </Text>
                    
                    <View className="flex-row flex-wrap gap-2">
                      {personalitySummary.hashtags.map((tag, i) => (
                        <View key={i} className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                          <Text className="text-indigo-300 text-xs font-bold">
                            #{tag.replace(/^#/, "")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 ml-1">
                  DETAILED ANSWERS
                </Text>

                {PAGES.flatMap((p) => p.questions).map((q, idx) => (
                  <View
                    key={q.id}
                    className="mb-4 bg-white/5 p-5 rounded-[32px] border border-white/10"
                  >
                    <Text className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                      Question {idx + 1}
                    </Text>
                    <Text className="text-white text-lg font-bold mb-3">
                      {q.question}
                    </Text>
                    <View className="bg-indigo-500/20 px-4 py-3 rounded-2xl border border-indigo-400/30 flex-row items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#818cf8"
                        className="mr-2"
                      />
                      <Text className="text-indigo-100 font-medium ml-2">
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
                      <View className="bg-indigo-500/30 px-3 py-1 rounded-full mr-3">
                        <Text className="text-indigo-300 font-bold">
                          {currentPageIndex * 2 + i + 1}
                        </Text>
                      </View>
                      <Text className="text-white text-xl font-bold flex-1">
                        {q.question}
                      </Text>
                    </View>

                    <View className="space-y-4 gap-3">
                      {q.options.map((option) => {
                        const isSelected = answers[q.field] === option.value;
                        return (
                          <TouchableOpacity
                            key={option.optionId}
                            onPress={() =>
                              handleSelectOption(q.field, option.value)
                            }
                            className={`p-5 rounded-3xl border-2 flex-row items-center justify-between ${
                              isSelected
                                ? "bg-indigo-500/30 border-indigo-400"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <Text
                              className={`text-lg font-medium ${isSelected ? "text-white" : "text-white/70"}`}
                            >
                              {option.label}
                            </Text>
                            {isSelected && (
                              <View className="bg-indigo-400 rounded-full p-1">
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

          {/* Bottom Button */}
          <View className="absolute bottom-10 left-6 right-6 flex-row gap-4">
            {showSummary && (
              <TouchableOpacity
                onPress={() => {
                  setShowSummary(false);
                  setCurrentPageIndex(0);
                  setAnswers({});
                  setContextAnswers({});
                  setPersonalitySummary(null);
                }}
                className="flex-1 bg-white/10 h-16 rounded-3xl items-center justify-center border border-white/20 flex-row"
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
              onPress={showSummary ? handleFinish : handleNext}
              disabled={isSummarizing}
              className={`${showSummary ? "flex-1" : "w-full"} bg-white h-16 rounded-3xl items-center justify-center shadow-xl flex-row ${isSummarizing ? "opacity-70" : ""}`}
            >
              {isSummarizing ? (
                <ActivityIndicator color="#312e81" />
              ) : (
                <>
                  <Text className="text-indigo-900 text-lg font-bold mr-2">
                    {showSummary
                      ? "Get Started"
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
                    color="#312e81"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
    </LinearGradient>
  );
}
