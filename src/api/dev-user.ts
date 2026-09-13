import { api } from "./client.ts";
import { endpoints } from "./endpoints.ts";

export interface DevLoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}

export async function devLogin(accountNumber: number): Promise<DevLoginResponse> {
  const { data } = await api.post<DevLoginResponse>(
    endpoints.user.devLogin(accountNumber),
  );

  return data;
}
