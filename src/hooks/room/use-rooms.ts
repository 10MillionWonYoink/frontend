import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  getRoom,
  getRooms,
  getMyRooms,
  joinRoom,
  joinByInviteCode,
} from "../../api/room";

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
    enabled: Boolean(roomId) && /^\d+$/.test(roomId ?? "") && Number(roomId) > 0,
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
    mutationFn: joinRoom,
    onSuccess: () => {
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
