const encodePathSegment = (value: string | number) => encodeURIComponent(String(value));

export const endpoints = {
  auth: {
    kakao: "/auth/kakao",
    me: "/auth/me",
    signup: "/auth/signup",
  },
  room: {
    list: "/rooms",
    create: "/rooms",
    join: "/rooms/join",
    detail: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}`,
    ready: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}/ready`,
    start: (roomId: string | number) => `/rooms/${encodePathSegment(roomId)}/start`,
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
