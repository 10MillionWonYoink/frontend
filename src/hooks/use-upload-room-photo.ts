import { useMutation } from '@tanstack/react-query';
import { uploadRoomImage, type UploadRoomImageParams, type UploadRoomPhotoResponse } from "../api/upload-room-image.ts";

export function useUploadRoomPhoto() {
  return useMutation<
    UploadRoomPhotoResponse,
    Error,
    UploadRoomImageParams
  >({
    mutationFn: uploadRoomImage,
  });
}