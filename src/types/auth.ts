export interface CurrentUser {
  id: number;
  email: string | null;
  nickname: string;
  profileImageUrl: string | null;
}

export type MeResponse =
  { authenticated: true; user: CurrentUser } | { authenticated: false; user?: null };

export interface SignupRequest {
  nickname: string;
}

export interface SignupResponse {
  message: string;
  user: CurrentUser;
}
