import { useMutation } from '@tanstack/react-query';
import { uploadRoomImage } from '../api/upload-room-image';

export function useUploadRoomPhoto() {
  return useMutation({
    mutationFn: uploadRoomImage,
  });
}