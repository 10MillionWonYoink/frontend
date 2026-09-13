import type { GameSessionStatus, GameTurnStatus } from "./game";

export interface GameResultTurn {
  turnNumber: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  status: GameTurnStatus;
  imageKey: string | null;
  submittedAt: string | null;
}

export interface GameResult {
  gameId: number;
  roomId: number;
  roomTitle: string | null;
  status: GameSessionStatus;
  totalTurns: number;
  startedAt: string | null;
  finishedAt: string | null;
  turns: GameResultTurn[];
}
