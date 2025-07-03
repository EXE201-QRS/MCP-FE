import http from "@/lib/http";
import { UploadFileResType } from "@/schemaValidations/media.model";

export const mediaApiRequest = {
  upload: (folderType: string, files: FormData) =>
    http.post<UploadFileResType>(
      `/media/images/upload?folderName=${folderType}`,
      files
    ),
};
