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

export interface UploadRoomImageParams {
  roomId: number;
  file: File;
}

export interface UploadRoomPhotoResponse {
  objectKey: string;
  eTag: string | null;
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
                                      }: UploadRoomImageParams): Promise<UploadRoomPhotoResponse> {
  if (!isAllowedImageType(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다.');
  }

  if (file.size >  10 * 1024 * 1024) {
    throw new Error('사진은 최대 10MB까지 업로드할 수 있습니다.');
  }

  if (file.size < 1) {
    throw new Error('빈 파일은 업로드할 수 없습니다.');
  }

  // 백엔드에서 Presigned URL 발급
  const { data } =
    await api.post<CreateUploadUrlResponse>(
      '/uploads/presigned-url',
      {
        roomId,
        contentType: file.type,
        fileSize: file.size,
      },
    );

  // 발급받은 URL로 S3에 직접 업로드
  let uploadResponse: Response;

  try {
    uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
  } catch {
    // fetch() 자체가 실패하면(네트워크 끊김, CORS 등) 브라우저가 던지는 원문 메시지가
    // "Failed to fetch"처럼 사용자에게 의미 없는 문구라 그대로 노출하지 않는다.
    throw new Error('네트워크 연결을 확인하고 다시 시도해주세요.');
  }

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