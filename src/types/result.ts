import type { GameSessionStatus, GameTurnStatus } from "./game";

export interface GameRanking {
  userId: number;
  nickname: string;
  totalScore: number;
  rank: number;
}

export interface GameResultTurn {
  turnNumber: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  status: GameTurnStatus;
  imageKey: string | null;
  submittedAt: string | null;
  // Revealed for every turn only once the game has finished.
  topic: string | null;
  score: number | null;
  feedback: string | null;
}

export interface GameResult {
  gameId: number;
  roomId: number;
  roomTitle: string | null;
  status: GameSessionStatus;
  topic: string | null;
  totalTurns: number;
  startedAt: string | null;
  finishedAt: string | null;
  evaluationComplete: boolean;
  ranking: GameRanking[];
  turns: GameResultTurn[];
}
