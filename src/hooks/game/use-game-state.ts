import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGameState, submitGamePhoto } from "../../api/game";
import type { GameState } from "../../types/game";

export const gameQueryKeys = {
  detail: (roomId: string) => ["game", roomId] as const,
};

export function useGameState(roomId: string | undefined) {
  return useQuery({
    queryKey: gameQueryKeys.detail(roomId ?? ""),
    queryFn: () => getGameState(roomId ?? ""),
    enabled: Boolean(roomId),
  });
}

export function useSubmitGamePhoto(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: File) => submitGamePhoto(roomId, image),
    onSuccess: (response) => {
      queryClient.setQueryData<GameState>(gameQueryKeys.detail(roomId), (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          status: "SUBMITTED",
          submittedImageUrl: response.imageUrl,
        };
      });
    },
  });
}
