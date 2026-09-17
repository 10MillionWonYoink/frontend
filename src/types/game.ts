export type GameSessionStatus = "countdown" | "in_progress" | "finished" | "cancelled";
export type GameTurnStatus = "waiting" | "in_progress" | "submitted" | "expired";

export interface LatestGame {
  gameId: number;
  roomId: number;
  status: GameSessionStatus;
  countdownEndsAt: string | null;
  currentTurnNumber: number;
  totalTurns: number;
}

export interface GameTurnSummary {
  turnNumber: number;
  userId: number;
  nickname: string;
  status: GameTurnStatus;
  imageKey: string | null;
  submittedAt: string | null;
}

export interface CurrentGameTurn {
  turnNumber: number;
  userId: number;
  nickname: string;
  startedAt: string;
  expiresAt: string;
  // Backend redacts this to null unless the requester owns the turn.
  topic: string | null;
}

export interface GameSessionState {
  gameId: number;
  roomId: number;
  status: GameSessionStatus;
  topic: string | null;
  countdownEndsAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  currentTurnNumber: number;
  totalTurns: number;
  timeLimitSeconds: number;
  currentTurn: CurrentGameTurn | null;
  turns: GameTurnSummary[];
}
