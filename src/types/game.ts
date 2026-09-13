// Legacy presentation model only; no Backend API currently returns this shape.
// Do not use this as an HTTP or Socket.IO response type. See docs/backend-integration.md.
export type GameStatus =
  "WAITING" | "PLAYING" | "MY_TURN" | "OTHER_TURN" | "SUBMITTED" | "FINISHED";

export interface GameState {
  roomId: number;
  status: GameStatus;
  round: number;
  totalRounds: number;
  turnOrder: number;
  totalPlayers: number;
  currentPlayerId: number;
  currentPlayerNickname: string;
  mission: string;
  missionEmoji: string;
  remainingSeconds: number;
  submittedImageUrl: string | null;
}
