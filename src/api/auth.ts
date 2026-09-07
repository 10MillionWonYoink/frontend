import type { MeResponse, SignupRequest, SignupResponse } from "../types/auth";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>(endpoints.auth.me);
  return data;
}

export async function signup(request: SignupRequest): Promise<SignupResponse> {
  const { data } = await api.post<SignupResponse>(endpoints.auth.signup, request);
  return data;
}
