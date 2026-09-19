import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMe } from "../use-me";
import { roomQueryKeys, useRoom } from "./use-rooms";
import { useLobbySocket } from "../websocket/useLobbySocket";

export function useRoomLobby(roomId: string) {
  const meQuery = useMe();
  const roomQuery = useRoom(roomId);
  const queryClient = useQueryClient();
  const room = roomQuery.data;
  const currentPlayer = room?.players.find(
    (player) => player.id === meQuery.data?.user?.id,
  );
  const socket = useLobbySocket(
    Number(roomId),
    Boolean(currentPlayer && room && ["WAITING", "READY"].includes(room.status)),
  );
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
  };
  const readyMutation = useMutation({
    mutationFn: socket.setReady,
    onSettled: refresh,
  });
  const leaveMutation = useMutation({ mutationFn: socket.leave, onSuccess: refresh });
  const updateMutation = useMutation({
    mutationFn: socket.updateRoom,
    onSettled: refresh,
  });
  const hostMutation = useMutation({
    mutationFn: socket.changeHost,
    onSettled: refresh,
  });
  const startGameMutation = useMutation({
    mutationFn: socket.startGame,
    onSettled: refresh,
  });
  const chatMutation = useMutation({ mutationFn: socket.sendRoomChat });
  const mutationError =
    readyMutation.error ??
    leaveMutation.error ??
    updateMutation.error ??
    hostMutation.error ??
    startGameMutation.error;
  const isMutating =
    readyMutation.isPending ||
    leaveMutation.isPending ||
    updateMutation.isPending ||
    hostMutation.isPending ||
    startGameMutation.isPending;
  return {
    room,
    currentPlayer,
    socket,
    isPending: meQuery.isPending || roomQuery.isPending,
    roomError: roomQuery.error,
    refetchRoom: roomQuery.refetch,
    actionError: mutationError
      ? mutationError.message || "요청을 처리하지 못했습니다."
      : socket.error,
    isMutating,
    setReady: readyMutation.mutate,
    leave: leaveMutation.mutateAsync,
    updateRoom: updateMutation.mutateAsync,
    changeHost: hostMutation.mutateAsync,
    startGame: startGameMutation.mutate,
    sendRoomChat: chatMutation.mutateAsync,
    isSendingRoomChat: chatMutation.isPending,
    roomChatError: chatMutation.error?.message,
  };
}
