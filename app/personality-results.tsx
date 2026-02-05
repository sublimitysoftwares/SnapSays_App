import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PAGES } from "../constants/questions";
import SafeScreen from "./component/SafeScreen";

import { useAuth } from "../context/AuthContext";

export default function PersonalityResultsScreen() {
  const router = useRouter();
  const { answers, personalitySummary } = useAuth();

  const getSelectedLabel = (field: string, value: string) => {
    if (!value) return "Not answered";
    for (const page of PAGES) {
      const question = page.questions.find((q) => q.field === field);
      if (question) {
        const option = question.options.find((opt) => opt.value === value);
        return option ? option.label : value;
      }
    }
    return value;
  };

  const handleRetakeQuiz = () => {
    router.push("/(auth)/onboarding");
  };

  return (
    <LinearGradient
      colors={["#4f46e5", "#312e81", "#1e1b4b"]}
      className="flex-1"
    >
      <SafeScreen>
        <View className="flex-1 px-4 py-2">
            
          {/* Header */}
          <View className="flex-row items-center mb-6 mt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 bg-white/10 rounded-full mr-4"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">
              Personality Analysis
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {personalitySummary ? (
              <View className="mb-8 bg-indigo-500/20 p-6 rounded-[32px] border border-indigo-400/30">
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
            ) : (
              <Text className="text-white/70 text-base mb-6 px-1">
                Here's a summary of your personality profile based on your answers.
              </Text>
            )}

            <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">
               YOUR ANSWERS
            </Text>

            {PAGES.flatMap((p) => p.questions).map((q, idx) => (
              <View
                key={q.id}
                className="mb-3 bg-white/10 p-4 rounded-2xl border border-white/5"
              >
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-2">
                        <Text className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Question {idx + 1}
                        </Text>
                        <Text className="text-white text-base font-semibold mb-2 leading-5">
                        {q.question}
                        </Text>
                    </View>
                </View>
                
                <View className="bg-indigo-500/20 px-3 py-2 rounded-xl border border-indigo-400/30 flex-row items-center self-start">
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#818cf8"
                    className="mr-2"
                  />
                  <Text className="text-indigo-100 text-sm font-medium ml-1">
                    {getSelectedLabel(q.field, answers[q.field])}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom Button */}
          <View className="absolute bottom-6 left-4 right-4 bg-transparent">
             <TouchableOpacity
              onPress={handleRetakeQuiz}
              className="bg-white h-14 rounded-2xl items-center justify-center shadow-lg flex-row"
            >
              <Text className="text-indigo-900 text-lg font-bold mr-2">
                Retake Quiz
              </Text>
              <Ionicons name="refresh" size={20} color="#312e81" />
            </TouchableOpacity>
          </View>

        </View>
      </SafeScreen>
    </LinearGradient>
  );
}
