// Legacy presentation model only; no Backend API currently returns this shape.
// Do not use this as an HTTP or Socket.IO response type. See docs/backend-integration.md.
export interface Ranking {
  rank: number;
  userId: number;
  nickname: string;
  avatar: string | null;
  score: number;
  creativity: number;
  photoUrl: string | null;
  feedback: string;
}

export interface GameResult {
  roomId: number;
  title: string;
  totalRounds: number;
  rankings: Ranking[];
}
