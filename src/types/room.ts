export type RoomStatus = "WAITING" | "READY" | "PLAYING" | "FINISHED";

export interface RoomPlayer {
  id: number;
  nickname: string;
  avatar: string | null;
  isReady: boolean;
  isHost: boolean;
}

export interface RoomSummary {
  id: number;
  title: string;
  status: RoomStatus;
  currentPlayers: number;
  maxPlayers: number;
}

export interface Room extends RoomSummary {
  hostName: string;
  invitationCode: string;
  players: RoomPlayer[];
  turnSeconds: number;
  totalRounds: number;
}

export interface CreateRoomRequest {
  title: string;
  maxPlayers: number;
  turnSeconds: number;
  totalRounds: number;
}

export interface JoinRoomRequest {
  invitationCode: string;
}

export interface JoinRoomResponse {
  roomId: number;
}

export interface UpdateReadyRequest {
  isReady: boolean;
}
