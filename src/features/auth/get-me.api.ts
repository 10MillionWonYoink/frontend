import { api } from "../../api/client.ts";

export interface CurrentUser {
  id: number;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
}

interface MeResponse {
  authenticated: true;
  user: CurrentUser;
}

export async function getMe(): Promise<MeResponse> {
  const response =
    await api.get<MeResponse>(
      "/auth/me",
    );

  return response.data;
}