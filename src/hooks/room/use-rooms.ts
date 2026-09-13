import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  getRoom,
  getRooms,
  getMyRooms,
  joinRoom,
  joinByInviteCode,
} from "../../api/room";
import type { CreateRoomRequest, MyRoomSummary } from "../../types/room";
import { isValidRoomId } from "../../utils/is-valid-room-id";

export const roomQueryKeys = {
  all: ["rooms"] as const,
  list: ["rooms", "list"] as const,
  mine: ["rooms", "mine"] as const,
  detail: (roomId: string) => ["rooms", "detail", roomId] as const,
};

export function useRooms() {
  return useQuery({
    queryKey: roomQueryKeys.list,
    queryFn: getRooms,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useMyRooms() {
  return useQuery({
    queryKey: roomQueryKeys.mine,
    queryFn: getMyRooms,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: roomQueryKeys.detail(roomId ?? ""),
    queryFn: () => getRoom(roomId ?? ""),
    enabled: isValidRoomId(roomId),
    // Backend does not broadcast REST joins; refresh membership while in the lobby.
    refetchInterval: (query) =>
      ["WAITING", "READY"].includes(query.state.data?.status ?? "") ? 5_000 : false,
    refetchOnWindowFocus: true,
  });
}

const ALREADY_IN_ANOTHER_ROOM_MESSAGE =
  "이미 다른 방에 참여 중입니다. 기존 방에서 나간 뒤 다시 시도해주세요.";

// A finished game's membership row is never cleared (Backend only allows leaving a
// WAITING room), so it must not count as "active" or the user could never join again.
export function hasOtherActiveRoom(currentRooms: MyRoomSummary[]): boolean {
  return currentRooms.some((room) => room.status !== "finished");
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateRoomRequest) => {
      // Policy: a user may be an active member of only one room at a time.
      const currentRooms = await getMyRooms();
      if (hasOtherActiveRoom(currentRooms))
        throw new Error(ALREADY_IN_ANOTHER_ROOM_MESSAGE);
      return createRoom(request);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roomId: number) => {
      // The REST join route is not idempotent. Check current membership before writing.
      const currentRooms = await getMyRooms();
      const alreadyJoined = currentRooms.some((room) => room.id === roomId);
      if (!alreadyJoined) {
        // Policy: a user may be an active member of only one room at a time.
        if (hasOtherActiveRoom(currentRooms))
          throw new Error(ALREADY_IN_ANOTHER_ROOM_MESSAGE);
        await joinRoom(roomId);
      }
      return alreadyJoined;
    },
    onSuccess: (alreadyJoined) => {
      if (!alreadyJoined)
        void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
    },
  });
}

export function useJoinByInviteCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      // Policy: a user may be an active member of only one room at a time.
      const currentRooms = await getMyRooms();
      if (hasOtherActiveRoom(currentRooms))
        throw new Error(ALREADY_IN_ANOTHER_ROOM_MESSAGE);
      return joinByInviteCode(inviteCode);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
    },
  });
}
