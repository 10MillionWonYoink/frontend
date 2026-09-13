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
