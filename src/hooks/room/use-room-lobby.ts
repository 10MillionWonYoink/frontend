import { useMe } from "../use-me";
import { useRoom, useStartGame, useUpdateReady } from "./use-rooms";

const MINIMUM_PLAYERS_TO_START = 2;

export function useRoomLobby(roomId: string) {
  const meQuery = useMe();
  const roomQuery = useRoom(roomId);
  const readyMutation = useUpdateReady(roomId);
  const startMutation = useStartGame(roomId);

  const currentUserId = meQuery.data?.user?.id;
  const currentPlayer = roomQuery.data?.players.find(
    (player) => player.id === currentUserId,
  );
  const otherPlayers = roomQuery.data?.players.filter((player) => !player.isHost) ?? [];
  const isEveryPlayerReady = otherPlayers.every((player) => player.isReady);
  const canStart = Boolean(
    currentPlayer?.isHost &&
    roomQuery.data &&
    roomQuery.data.players.length >= MINIMUM_PLAYERS_TO_START &&
    isEveryPlayerReady,
  );

  return {
    canStart,
    currentPlayer,
    isPending: meQuery.isPending || roomQuery.isPending,
    room: roomQuery.data,
    roomError: roomQuery.error,
    isReadyUpdating: readyMutation.isPending,
    isStarting: startMutation.isPending,
    refetchRoom: roomQuery.refetch,
    setReady: (isReady: boolean) => readyMutation.mutate(isReady),
    startGame: startMutation.mutateAsync,
  };
}
