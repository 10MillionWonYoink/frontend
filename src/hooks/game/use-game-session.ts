import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { GameSocketEvent, GameState } from "../../types/game";
import { useGameSocket } from "../websocket/useGameSocket";
import { useCountdown } from "./use-countdown";
import { gameQueryKeys, useGameState, useSubmitGamePhoto } from "./use-game-state";

export function useGameSession(roomId: string, onGameFinish: () => void) {
  const queryClient = useQueryClient();
  const gameQuery = useGameState(roomId);
  const photoMutation = useSubmitGamePhoto(roomId);

  const handleSocketEvent = useCallback(
    (event: GameSocketEvent) => {
      if (event.type === "GAME_START" || event.type === "TURN_START") {
        queryClient.setQueryData(gameQueryKeys.detail(roomId), event.payload);
        return;
      }

      if (event.type === "GAME_FINISH") {
        queryClient.setQueryData<GameState>(gameQueryKeys.detail(roomId), (previous) =>
          previous ? { ...previous, status: "FINISHED" } : previous,
        );
        onGameFinish();
        return;
      }

      queryClient.setQueryData<GameState>(gameQueryKeys.detail(roomId), (previous) => {
        if (!previous) {
          return previous;
        }

        if (event.type === "PHOTO_SUBMIT") {
          return {
            ...previous,
            status: "SUBMITTED",
            submittedImageUrl: event.payload.imageUrl,
            remainingSeconds:
              event.payload.remainingSeconds ?? previous.remainingSeconds,
          };
        }

        return { ...previous, ...event.payload };
      });
    },
    [onGameFinish, queryClient, roomId],
  );

  const socket = useGameSocket(roomId, handleSocketEvent);
  const game = gameQuery.data;
  const remainingSeconds = useCountdown(
    game?.remainingSeconds ?? 0,
    !game || game.status === "SUBMITTED" || game.status === "FINISHED",
  );

  return {
    game,
    gameError: gameQuery.error,
    isGamePending: gameQuery.isPending,
    isSubmitting: photoMutation.isPending,
    refetchGame: gameQuery.refetch,
    remainingSeconds,
    socketStatus: socket.status,
    submitPhoto: photoMutation.mutateAsync,
    submitError: photoMutation.error,
  };
}
