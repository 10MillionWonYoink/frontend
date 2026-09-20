import type {
  BackendRoomDetailResponse,
  BackendRoomStatus,
  CreateRoomRequest,
  CreateRoomResponse,
  InviteResponse,
  JoinByCodeResponse,
  JoinRoomResponse,
  MyRoomSummary,
  Room,
  RoomStatus,
  RoomSummary,
} from "../types/room";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getRooms(): Promise<RoomSummary[]> {
  const { data } = await api.get<RoomSummary[]>(endpoints.room.list);
  return data;
}

export async function getMyRooms(): Promise<MyRoomSummary[]> {
  const { data } = await api.get<MyRoomSummary[]>(endpoints.room.mine);
  return data;
}

export async function getRoom(roomId: string): Promise<Room> {
  const { data } = await api.get<BackendRoomDetailResponse>(
    endpoints.room.detail(roomId),
  );

  return {
    id: data.id,
    title: data.title,
    status: mapRoomStatus(data.status),
    hostId: data.hostId,
    hostName: data.hostName,
    minPlayers: data.minPlayers,
    maxPlayers: data.maxPlayers,
    currentPlayers: data.currentPlayers,
    isPublic: data.isPublic,
    invitationCode: data.invitationCode,
    turnSeconds: data.turnSeconds,
    totalRounds: data.totalRounds,
    players: data.players.map((player) => ({
      id: player.userId,
      nickname: player.nickname,
      avatar: player.profileImageUrl,
      isReady: player.isReady,
      isHost: player.isHost,
    })),
    updatedAt: data.updatedAt,
  };
}

const roomStatusMap: Record<BackendRoomStatus, RoomStatus> = {
  waiting: "WAITING",
  countdown: "READY",
  in_progress: "PLAYING",
  finished: "FINISHED",
};

function mapRoomStatus(status: BackendRoomStatus): RoomStatus {
  return roomStatusMap[status];
}

export async function createRoom(
  request: CreateRoomRequest,
): Promise<CreateRoomResponse> {
  const { data } = await api.post<CreateRoomResponse>(endpoints.room.create, request);
  return data;
}

export async function joinRoom(roomId: number): Promise<JoinRoomResponse> {
  const { data } = await api.post<JoinRoomResponse>(endpoints.room.join(roomId));
  return data;
}

export async function joinByInviteCode(
  inviteCode: string,
): Promise<JoinByCodeResponse> {
  const { data } = await api.post<JoinByCodeResponse>(
    endpoints.room.codeJoin(inviteCode.trim()),
  );
  return data;
}

export async function getInvite(roomId: number): Promise<InviteResponse> {
  const { data } = await api.get<InviteResponse>(endpoints.room.invite(roomId));
  return data;
}
