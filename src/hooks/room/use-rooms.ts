import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  getRoom,
  getRooms,
  getMyRooms,
  joinRoom,
  joinByInviteCode,
} from "../../api/room";
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

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
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
      if (!alreadyJoined) await joinRoom(roomId);
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
    mutationFn: joinByInviteCode,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
    },
  });
}
