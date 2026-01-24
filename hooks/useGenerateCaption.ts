import { useMutation } from "@tanstack/react-query";
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
    }) => {
      if (!selectedImage) {
        throw new Error("No image selected");
      }

      const fileInfo = await FileSystem.getInfoAsync(selectedImage);
      if (!fileInfo.exists) throw new Error("File not found");

      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage,
        name: selectedImage.split("/").pop() || "image.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("description", description);

      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL ||
          "http://192.168.43.133:5000/api/generate-caption",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(`${errorMessage} (${response.status})`);
      }

      return response.json();
    },
  });
};
