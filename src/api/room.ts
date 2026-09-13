import type {
  CreateRoomRequest,
  CreateRoomResponse,
  InviteResponse,
  JoinByCodeResponse,
  JoinRoomResponse,
  MyRoomSummary,
  Room,
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
  const { data } = await api.get<Room>(endpoints.room.detail(roomId));
  return data;
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
