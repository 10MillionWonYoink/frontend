export type RoomStatus = "WAITING" | "READY" | "PLAYING" | "FINISHED";
export type BackendRoomStatus = "waiting" | "countdown" | "in_progress" | "finished";

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

export interface BackendRoom {
  id: number;
  title: string;
  hostId: number;
  status: BackendRoomStatus;
  minParticipants: number;
  maxParticipants: number;
  isPublic: boolean;
  inviteCode: string;
  timeLimitSeconds: number;
  relayCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomMember {
  id: number;
  roomId: number;
  userId: number;
  isReady: boolean;
  turnOrder: number | null;
  joinedAt: string;
  leftAt: string | null;
}

export interface Room extends RoomSummary {
  room: BackendRoom;
  members: RoomMember[];
  hostName: string;
  invitationCode: string;
  players: RoomPlayer[];
  turnSeconds: number;
  totalRounds: number;
}

export interface MyRoomSummary extends Omit<RoomSummary, "status"> {
  status: BackendRoomStatus;
}

export interface CreateRoomRequest {
  title: string;
  maxParticipants?: number;
  isPublic?: boolean;
  timeLimitSeconds?: number;
  relayCount?: number;
}

export interface CreateRoomResponse {
  room: BackendRoom;
  members: RoomMember[];
}

export interface JoinRoomResponse {
  message: string;
  roomId: number;
  memberId: number;
  alreadyJoined: boolean;
}

export interface JoinByCodeResponse {
  message: string;
  roomId: number;
  member: RoomMember;
}

export interface InviteResponse {
  roomId: number;
  inviteCode: string;
  inviteUrl: string;
}
