const encodePathSegment = (value: string | number) => encodeURIComponent(String(value));

export const endpoints = {
  auth: { kakao: "/auth/kakao", me: "/auth/me", signup: "/auth/signup" },
  user: { devLogin: (accountNumber: number) => `/users/dev-login/${accountNumber}` },
  room: {
    list: "/rooms",
    mine: "/rooms/my",
    create: "/rooms",
    join: (roomId: number) => `/rooms/${encodePathSegment(roomId)}/join`,
    codeJoin: (inviteCode: string) =>
      `/rooms/invites/${encodePathSegment(inviteCode)}/join`,
    detail: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}`,
    invite: (roomId: number) => `/rooms/${encodePathSegment(roomId)}/invite`,
  },
} as const;
