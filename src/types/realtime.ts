import type { BackendRoomStatus } from "./room";

export interface LobbyState {
  id: number;
  title: string;
  status: BackendRoomStatus;
  hostId: number;
  host: { id: number; nickname: string | null; profileImageUrl: string | null };
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  inviteCode: string;
  relayCount: number;
  timeLimitSeconds: number;
  members: {
    memberId: number;
    userId: number;
    nickname: string | null;
    profileImageUrl: string | null;
    isReady: boolean;
    isHost: boolean;
    joinedAt: string;
  }[];
}

export interface RoomUpdate {
  roomId: number;
  title?: string;
  minParticipants?: number;
  maxParticipants?: number;
  isPublic?: boolean;
  relayCount?: number;
  timeLimitSeconds?: number;
}

export interface RoomUpdated extends Omit<RoomUpdate, "roomId"> {
  id: number;
  title: string;
  status: BackendRoomStatus;
  hostId: number;
  minParticipants: number;
  maxParticipants: number;
  isPublic: boolean;
  relayCount: number;
  timeLimitSeconds: number;
  updatedAt: string;
}

export interface LeaveResult {
  message: string;
  roomId: number;
  leftUserId: number;
  roomDeleted: boolean;
  hostChanged: boolean;
  previousHostId: number | null;
  newHostId: number | null;
  currentParticipants: number;
}

export type Acknowledgement = { success: true };
export type SocketFailure = { message?: string | string[]; status?: string };
export interface HostChangeResult {
  roomId: number;
  previousHostId: number;
  newHostId: number;
}
export interface ServerToClientEvents {
  "lobby:state": (state: LobbyState) => void;
  "lobby:ready-changed": (member: {
    roomId: number;
    userId: number;
    isReady: boolean;
  }) => void;
  "lobby:room-updated": (room: RoomUpdated) => void;
  "lobby:host-changed": (result: HostChangeResult) => void;
  "lobby:member-left": (result: {
    roomId: number;
    userId: number;
    currentParticipants: number;
  }) => void;
  "lobby:room-closed": (result: { roomId: number }) => void;
  exception: (error: SocketFailure) => void;
}
export interface ClientToServerEvents {
  "lobby:subscribe": (
    body: { roomId: number },
    ack: (result: Acknowledgement & { roomId: number }) => void,
  ) => void;
  "lobby:ready:set": (
    body: { roomId: number; isReady: boolean },
    ack: (result: Acknowledgement) => void,
  ) => void;
  "lobby:room:update": (
    body: RoomUpdate,
    ack: (result: Acknowledgement & { room: RoomUpdated }) => void,
  ) => void;
  "lobby:host:change": (
    body: { roomId: number; newHostUserId: number },
    ack: (result: Acknowledgement & HostChangeResult) => void,
  ) => void;
  "lobby:leave": (
    body: { roomId: number },
    ack: (result: Acknowledgement & LeaveResult) => void,
  ) => void;
}
