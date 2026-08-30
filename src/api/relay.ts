import { api } from "./client";
import type { Relay } from "../types/relay";

/**
 * 백엔드 Swagger에 사진 릴레이 API가 확정되면
 * 실제 endpoint와 response 타입으로 교체합니다.
 */
export async function getRelay(relayId: string): Promise<Relay> {
  const { data } = await api.get<Relay>(`/relay/${relayId}`);
  return data;
}

export async function uploadRelayPhoto(
  relayId: string,
  file: File
): Promise<Relay> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post<Relay>(
    `/relay/${relayId}/photo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
}