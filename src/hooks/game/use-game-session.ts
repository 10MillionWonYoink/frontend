import { useMutation } from "@tanstack/react-query";
import { useLatestGameByRoom, useGameSessionQuery } from "./use-games";
import { useGameSocket } from "../websocket/useGameSocket";

export function useGameSession(roomId: string) {
  const latestGameQuery = useLatestGameByRoom(roomId);
  const gameId = latestGameQuery.data?.gameId;
  const gameQuery = useGameSessionQuery(gameId);
  const isFinished =
    gameQuery.data?.status === "finished" || gameQuery.data?.status === "cancelled";
  const socket = useGameSocket(gameId, Boolean(gameId) && !isFinished);
  const submitMutation = useMutation({ mutationFn: socket.submitTurn });

  return {
    isPending: latestGameQuery.isPending || (Boolean(gameId) && gameQuery.isPending),
    error: latestGameQuery.error ?? gameQuery.error,
    game: gameQuery.data,
    socketStatus: socket.status,
    submitTurn: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
    refetch: gameQuery.refetch,
  };
}
