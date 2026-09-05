import { api } from "../../api/client.ts";

interface SignupRequest {
  nickname: string;
}

export async function signup(
  request: SignupRequest,
) {
  const response =
    await api.post(
      "/auth/signup",
      request,
    );

  return response.data;
}