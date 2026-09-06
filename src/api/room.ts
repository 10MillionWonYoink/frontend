import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  Room,
  RoomSummary,
  UpdateReadyRequest,
} from "../types/room";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getRooms(): Promise<RoomSummary[]> {
  const { data } = await api.get<RoomSummary[]>(endpoints.room.list);
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

export async function joinRoom(request: JoinRoomRequest): Promise<JoinRoomResponse> {
  const { data } = await api.post<JoinRoomResponse>(endpoints.room.join, request);
  return data;
}

export async function updateReady(
  roomId: string,
  request: UpdateReadyRequest,
): Promise<Room> {
  const { data } = await api.patch<Room>(endpoints.room.ready(roomId), request);
  return data;
}

export async function startGame(roomId: string): Promise<void> {
  await api.post(endpoints.room.start(roomId));
}
