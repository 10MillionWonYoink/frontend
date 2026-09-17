import type { BackendRoomPlayer, BackendRoomStatus } from "./room";
import type { GameSessionState, GameSessionStatus } from "./game";

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

export interface GameStartTurn {
  turnNumber: number;
  userId: number;
}

export interface GameStartedBroadcast {
  roomId: number;
  gameId: number;
  status: GameSessionStatus;
  countdownEndsAt: string;
  totalTurns: number;
  timeLimitSeconds: number;
  turns: GameStartTurn[];
}

export interface GameTurnStartedEvent {
  gameId: number;
  roomId: number;
  turnNumber: number;
  userId: number;
  startedAt: string;
  expiresAt: string;
}

export interface GameTurnSubmittedEvent {
  gameId: number;
  roomId: number;
  submittedTurn: { turnNumber: number; userId: number; imageKey: string };
}

export interface GameTurnExpiredEvent {
  gameId: number;
  roomId: number;
  expiredTurn: { turnNumber: number; userId: number };
}

export interface GameFinishedEvent {
  gameId: number;
  roomId: number;
}

export interface GameCancelledEvent {
  gameId: number;
  roomId: number;
  leftUserId: number;
  reason: string;
}

export interface SubmitTurnResult {
  finished: boolean;
  gameId: number;
  roomId: number;
  nextTurn: {
    turnNumber: number;
    userId: number;
    startedAt: string;
    expiresAt: string;
  } | null;
  submittedTurn: { turnNumber: number; userId: number; imageKey: string };
}

export interface ServerToClientEvents {
  "lobby:member-joined": (member: BackendRoomPlayer) => void;
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
  "lobby:game-started": (payload: GameStartedBroadcast) => void;
  "game:state": (state: GameSessionState) => void;
  "game:turn-started": (event: GameTurnStartedEvent) => void;
  "game:turn-submitted": (event: GameTurnSubmittedEvent) => void;
  "game:turn-expired": (event: GameTurnExpiredEvent) => void;
  "game:finished": (event: GameFinishedEvent) => void;
  "game:cancelled": (event: GameCancelledEvent) => void;
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
  "game:start": (
    body: { roomId: number },
    ack: (result: Acknowledgement & GameStartedBroadcast) => void,
  ) => void;
  "game:subscribe": (
    body: { gameId: number },
    ack: (result: Acknowledgement & { gameId: number }) => void,
  ) => void;
  "game:turn:submit": (
    body: { gameId: number; imageKey: string },
    ack: (result: Acknowledgement & SubmitTurnResult) => void,
  ) => void;
}
