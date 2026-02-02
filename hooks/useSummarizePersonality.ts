import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface SummarizePersonalityResponse {
  summary?: string;
  hashtags?: string[];
  success?: boolean;
}

export const useSummarizePersonality = () => {
  return useMutation({
    mutationFn: async ({
      answers,
      prompt,
    }: {
      answers: Record<string, string>;
      prompt: string;
    }): Promise<SummarizePersonalityResponse> => {
      console.log("SummarizePersonality Input:", { answers, promptLength: prompt.length });
      const formData = new FormData();

      const payload = {
        answers,
        command: prompt,
      };

      formData.append("description", JSON.stringify(payload));
      console.log("SummarizePersonality Payload:", JSON.stringify(payload));
      
      try {
        console.log("SummarizePersonality: Sending request to /api/summarize-personality...");
        const response = await axios.post(
          "http://192.168.29.153:5000/api/summarize-personality",
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000, // 30 second timeout
          },
        );
        console.log("SummarizePersonality Response Success:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("SummarizePersonality Error:", error);
        if (error.response) {
          console.error("SummarizePersonality Error Data:", error.response.data);
          console.error("SummarizePersonality Error Status:", error.response.status);
          const message = error.response.data?.message || "Summary failed";
          throw new Error(`${message} (${error.response.status})`);
        } else if (error.request) {
          console.error("SummarizePersonality No Request Error:", error.request);
          throw new Error("No response from server. Please check your network connection.");
        } else {
          console.error("SummarizePersonality Other Error:", error.message);
          throw new Error(error.message);
        }
      }
    },
  });
};
