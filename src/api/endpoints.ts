const encodePathSegment = (value: string | number) => encodeURIComponent(String(value));

export const endpoints = {
  auth: {
    kakao: "/auth/kakao",
    me: "/auth/me",
    signup: "/auth/signup",
  },
  user: {
    devLogin: (accountNumber: number) =>
      `/users/dev-login/${accountNumber}`,
  },
  room: {
    list: "/rooms",
    create: "/rooms",
    join: (roomId: number) => `/rooms/${encodePathSegment(roomId)}/join`,
    codeJoin: (inviteCode: string) => `/rooms/invites/${encodePathSegment(inviteCode)}/join`,
    detail: (roomId: number) => `/rooms/${encodePathSegment(roomId)}`,
    ready: (roomId: number) => `/rooms/${encodePathSegment(roomId)}/ready`,
    start: (roomId: number) => `/rooms/${encodePathSegment(roomId)}/start`,
  },
  game: {
    state: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}/game`,
    photo: (roomId: string | number) =>
      `/rooms/${encodePathSegment(roomId)}/game/photo`,
  },
  result: {
    detail: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}/result`,
  },
  websocket: {
    game: (roomId: string | number) => `/ws/rooms/${encodePathSegment(roomId)}`,
  },
} as const;
