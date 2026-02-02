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
import { useAuth } from "../../context/AuthContext";
import SafeScreen from "../component/SafeScreen";
import { useSummarizePersonality } from "../../hooks/useSummarizePersonality";
import { ActivityIndicator } from "react-native";
import { Colors } from "../../constants/Colors";
import { useAppTheme } from "../../context/ThemeContext";


const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [personalityText, setPersonalityText] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const { setIsOnboarded } = useAuth();
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useNotification();
  const { isDark } = useAppTheme();

  const { mutate: summarizePersonality, isPending: isSummarizing } = useSummarizePersonality();

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
      alert("Please answer all questions before moving to the next page.");
      return;
    }

    if (currentPageIndex < PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
      handleGenerateSummary();
    }
  };

  const handleGenerateSummary = () => {
    const descriptiveAnswers = PAGES.flatMap((p) => p.questions).map((q) => ({
      question: q.question,
      answer: getSelectedLabel(q.field, answers[q.field]),
    }));

    const prompt = `You are a personality summarization assistant.

You will receive a JSON object containing a list of personality-related questions and the user’s answers.

Your task:

Analyze the questions and answers as signals of the user’s personality, preferences, mindset, and behavior.

Generate:

One concise, friendly sentence that describes the person in a natural, human tone.

Exactly 3 relevant hashtags that best represent the person.

Rules:

Do not mention questions, forms, or surveys.

Do not repeat the answers verbatim.

Do not use emojis.

Keep the tone aligned with a modern consumer app (warm, confident, and relatable).

The output must be short and UI-ready.

JSON Data:
${JSON.stringify(descriptiveAnswers, null, 2)}

Return the response in JSON format with keys 'sentence' and 'hashtags'.`;

    setGenerationError(null);
    summarizePersonality(
      { answers, prompt },
      {
        onSuccess: (data) => {
          console.log("Personality Summarization Success:", data);
          try {
            const resultRaw = data.summary || (data as any).caption || "";
            let parsed;
            if (typeof resultRaw === 'string') {
              const jsonMatch = resultRaw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
              const cleaned = jsonMatch ? jsonMatch[1].trim() : resultRaw.trim();
              parsed = JSON.parse(cleaned);
            } else {
              parsed = resultRaw;
            }
            
            setPersonalityText(parsed.sentence || parsed.summary || parsed.caption || (typeof resultRaw === 'string' ? resultRaw : ""));
            setHashtags(parsed.hashtags || []);
            showSuccess("Personality profile generated!");
          } catch (e) {
            console.error("Failed to parse summary", e);
            // Fallback if parsing fails but there is a string
            const fallbackText = typeof data.summary === 'string' ? data.summary : "You are a unique individual with a fascinating personality!";
            setPersonalityText(fallbackText);
          }
        },
        onError: (err) => {
          console.error("Personality Summarization Error:", err);
          setGenerationError(err.message || "Something went wrong while generating your profile.");
          showError("Failed to generate summary: " + err.message);
        }
      }
    );
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
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
      colors={['#FF5ACD', '#BB65FF', '#4BB1FF']}
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {showSummary ? (
              <Animated.View entering={FadeInRight.duration(400)} key="summary">
                <Text className="text-white/60 text-lg mb-2">
                  Personality Insights ✨
                </Text>
                <Text className="text-white text-3xl font-black mb-8">
                  The Real You
                </Text>

                {isSummarizing ? (
                  <View className="bg-white/5 p-10 rounded-[40px] border border-white/10 items-center justify-center">
                    <ActivityIndicator size="large" color="white" />
                    <Text className="text-white/70 font-bold mt-6 text-center">
                      Analyzing your unique vibe...
                    </Text>
                  </View>
                ) : generationError ? (
                  <View className="bg-red-500/10 backdrop-blur-xl p-8 rounded-[40px] border border-red-500/20 items-center">
                    <Ionicons name="alert-circle" size={48} color="#f87171" />
                    <Text className="text-white text-xl font-bold mt-4 text-center">
                      Snap! Something went wrong
                    </Text>
                    <Text className="text-red-200/70 mt-2 text-center mb-6">
                      {generationError}
                    </Text>
                    <TouchableOpacity 
                      onPress={handleGenerateSummary}
                      className="bg-red-500/20 px-6 py-3 rounded-2xl border border-red-400/30 flex-row items-center"
                    >
                      <Ionicons name="refresh" size={18} color="white" />
                      <Text className="text-white font-bold ml-2">Try Again</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Animated.View 
                    entering={FadeInRight.delay(200)}
                    className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-2xl"
                  >
                    <View className="w-16 h-16 bg-indigo-500/30 rounded-3xl items-center justify-center mb-6">
                      <Ionicons name="sparkles" size={32} color="white" />
                    </View>
                    
                    <Text className="text-white text-2xl font-bold leading-tight mb-6">
                      {personalityText || "Generated profile will appear here."}
                    </Text>

                    {hashtags.length > 0 && (
                      <View className="flex-row flex-wrap gap-2">
                        {hashtags.map((tag, idx) => (
                          <View
                            key={idx}
                            className="bg-white/20 px-4 py-2 rounded-2xl border border-white/10"
                          >
                            <Text className="text-white font-black text-xs uppercase">
                              #{tag.replace("#", "")}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </Animated.View>
                )}
                
                <View className="mt-8 px-2">
                  <Text className="text-white/40 text-sm font-medium italic">
                    Based on your onboarding responses. You can always retake the quiz to refine your profile.
                  </Text>
                </View>
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
              disabled={showSummary && (isSummarizing || hashtags.length === 0)}
              className={`${showSummary ? "flex-1" : "w-full"} ${showSummary && (isSummarizing || hashtags.length === 0) ? "bg-white/20" : "bg-white"} h-16 rounded-3xl items-center justify-center shadow-xl flex-row`}
            >
              <Text className={`${showSummary && (isSummarizing || hashtags.length === 0) ? "text-white/40" : "text-indigo-900"} text-lg font-bold mr-2`}>
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
                color={showSummary && (isSummarizing || hashtags.length === 0) ? "rgba(255,255,255,0.4)" : "#312e81"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
    </LinearGradient>
  );
}
