import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PAGES } from "../constants/questions";
import { useAuth } from "../context/AuthContext";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";
import SafeScreen from "./component/SafeScreen";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { setIsOnboarded } = useAuth();
  const router = useRouter();

  const currentPage = PAGES[currentPageIndex];

  const handleSelectOption = (questionField: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionField]: value,
    }));
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
      // Final submission
      console.log("Final Answers:", answers);
      setIsOnboarded(true);
      router.replace("/(tabs)");

    }
  };

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const progress = (currentPageIndex + 1) / PAGES.length;

  return (
    <LinearGradient
      colors={["#4f46e5", "#312e81", "#1e1b4b"]}
      className="flex-1"
    >
      <SafeScreen>
        <View className="flex-1 px-6 py-4">
          {/* Header & Progress */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={handleBack}
              disabled={currentPageIndex === 0}
              className={`p-2 rounded-full ${currentPageIndex === 0 ? "opacity-0" : "bg-white/10"}`}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

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
              {currentPageIndex + 1}/{PAGES.length}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
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

              {currentPage.questions.map((q) => (
                <View key={q.id} className="mb-10">
                  <Text className="text-white text-xl font-bold mb-6">
                    {q.question}
                  </Text>

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
          </ScrollView>

          {/* Bottom Button */}
          <View className="absolute bottom-10 left-6 right-6">
            <TouchableOpacity
              onPress={handleNext}
              className="bg-white h-16 rounded-3xl items-center justify-center shadow-xl flex-row"
            >
              <Text className="text-indigo-900 text-lg font-bold mr-2">
                {currentPageIndex === PAGES.length - 1 ? "Finish" : "Continue"}
              </Text>
              <Ionicons
                name={
                  currentPageIndex === PAGES.length - 1
                    ? "checkmark-circle"
                    : "arrow-forward"
                }
                size={20}
                color="#312e81"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
    </LinearGradient>
  );
}
