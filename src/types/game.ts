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

export type GameEventType =
  "GAME_START" | "TURN_START" | "PHOTO_SUBMIT" | "TURN_END" | "GAME_FINISH";

interface GameEvent<TType extends GameEventType, TPayload> {
  type: TType;
  payload: TPayload;
}

export type GameSocketEvent =
  | GameEvent<"GAME_START", GameState>
  | GameEvent<"TURN_START", GameState>
  | GameEvent<
      "PHOTO_SUBMIT",
      { playerId: number; imageUrl: string; remainingSeconds?: number }
    >
  | GameEvent<"TURN_END", Partial<GameState>>
  | GameEvent<"GAME_FINISH", { roomId: number }>;

export interface SubmitPhotoResponse {
  imageUrl: string;
}
