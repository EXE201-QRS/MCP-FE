import { mediaApiRequest } from "@/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: ({
      folderType,
      files,
    }: {
      folderType: string;
      files: FormData;
    }) => mediaApiRequest.upload(folderType, files),
  });
};
