export interface CurrentUser {
  id: number;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
}

export type MeResponse =
  | { authenticated: true; registrationCompleted: boolean; user: CurrentUser }
  | { authenticated: false; user?: null };

export interface SignupRequest {
  nickname: string;
}

export interface SignupResponse {
  message: string;
  user: Pick<CurrentUser, "id" | "email" | "nickname">;
}
