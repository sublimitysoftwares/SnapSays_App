import { useMutation } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";

export interface GenerateCaptionResponse {
  caption?: string;
  imageUrl?: string;
  success?: boolean;
}

export const useGenerateCaption = () => {
  return useMutation<GenerateCaptionResponse, Error, string>({
    mutationFn: async (selectedImage: string) => {
      if (!selectedImage) {
        throw new Error("No image selected");
      }

      const fileInfo = await FileSystem.getInfoAsync(selectedImage);
      if (!fileInfo.exists) throw new Error("File not found");

      const response = await FileSystem.uploadAsync(
        "http://10.134.90.40:5000/api/generate-caption",
        selectedImage,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        },
      );

      if (response.status < 200 || response.status >= 300) {
        let errorMessage = "Upload failed";
        try {
          const errorData = JSON.parse(response.body);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(`${errorMessage} (${response.status})`);
      }

      return JSON.parse(response.body);
    },
  });
};
