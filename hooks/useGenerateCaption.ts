import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";

export interface GenerateCaptionResponse {
  caption?: string;
  imageUrl?: string;
  success?: boolean;
}

export const useGenerateCaption = () => {
  return useMutation({
    mutationFn: async ({
      selectedImage,
      description,
    }: {
      selectedImage: string;
      description: string;
    }): Promise<GenerateCaptionResponse> => {
      if (!selectedImage) throw new Error("No image selected");

      const fileInfo = await FileSystem.getInfoAsync(selectedImage);
      if (!fileInfo.exists) throw new Error("File not found");

      const formData = new FormData();

      formData.append("file", {
        uri: selectedImage,
        name: selectedImage.split("/").pop() || "image.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("description", description);

      try {
        const response = await axios.post(
          // process.env.EXPO_PUBLIC_API_URL ||
          "http://192.168.0.23:5000/api/generate-caption",
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          },
        );

        return response.data;
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status outside 2xx
          const message = error.response.data?.message || "Upload failed";
          throw new Error(`${message} (${error.response.status})`);
        } else if (error.request) {
          throw new Error("No response from server");
        } else {
          throw new Error(error.message);
        }
      }
    },
  });
};
