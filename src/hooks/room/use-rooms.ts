import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  getRoom,
  getRooms,
  joinRoom,
  startGame,
  updateReady,
} from "../../api/room";

export const roomQueryKeys = {
  all: ["rooms"] as const,
  list: ["rooms", "list"] as const,
  detail: (roomId: string) => ["rooms", "detail", roomId] as const,
};

export function useRooms() {
  return useQuery({ queryKey: roomQueryKeys.list, queryFn: getRooms });
}

export function useRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: roomQueryKeys.detail(roomId ?? ""),
    queryFn: () => getRoom(roomId ?? ""),
    enabled: Boolean(roomId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "WAITING" || status === "READY" ? 3_000 : false;
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roomQueryKeys.list });
    },
  });
}

export function useJoinRoom() {
  return useMutation({ mutationFn: joinRoom });
}

export function useUpdateReady(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isReady: boolean) => updateReady(roomId, { isReady }),
    onSuccess: (room) => {
      queryClient.setQueryData(roomQueryKeys.detail(roomId), room);
    },
  });
}

export function useStartGame(roomId: string) {
  return useMutation({ mutationFn: () => startGame(roomId) });
}
