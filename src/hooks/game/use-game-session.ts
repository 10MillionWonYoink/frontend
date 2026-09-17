import { useMutation } from "@tanstack/react-query";
import { useLatestGameByRoom, useGameSessionQuery } from "./use-games";
import { useGameSocket } from "../websocket/useGameSocket";
import { useMe } from "../use-me";

export function useGameSession(roomId: string) {
  const latestGameQuery = useLatestGameByRoom(roomId);
  const gameId = latestGameQuery.data?.gameId;
  const meQuery = useMe();
  const gameQuery = useGameSessionQuery(gameId, meQuery.data?.user?.id);
  const isFinished = gameQuery.data?.status === "finished";
  const socket = useGameSocket(gameId, Boolean(gameId) && !isFinished);
  const submitMutation = useMutation({ mutationFn: socket.submitTurn });

  return {
    isPending: latestGameQuery.isPending || (Boolean(gameId) && gameQuery.isPending),
    error: latestGameQuery.error ?? gameQuery.error,
    game: gameQuery.data,
    socketStatus: socket.status,
    playerLeftNotice: socket.playerLeftNotice,
    submitTurn: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
    refetch: gameQuery.refetch,
  };
}
