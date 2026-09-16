import { api } from "./client.ts";

type AllowedImageType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp';

interface CreateUploadUrlResponse {
  objectKey: string;
  uploadUrl: string;
  expiresIn: number;
}

interface UploadRoomImageParams {
  roomId: number;
  file: File;
}

function isAllowedImageType(
  contentType: string,
): contentType is AllowedImageType {
  return [
    'image/jpeg',
    'image/png',
    'image/webp',
  ].includes(contentType);
}

export async function uploadRoomImage({
                                        roomId,
                                        file,
                                      }: UploadRoomImageParams) {
  if (!isAllowedImageType(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다.');
  }

  // 백엔드에서 Presigned URL 발급
  const { data } =
    await api.post<CreateUploadUrlResponse>(
      '/uploads/presigned-url',
      {
        roomId,
        contentType: file.type,
      },
    );

  // 발급받은 URL로 S3에 직접 업로드
  const uploadResponse = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(
      `S3 업로드 실패: ${uploadResponse.status}`,
    );
  }

  return {
    objectKey: data.objectKey,
    eTag: uploadResponse.headers.get('ETag'),
  };
}