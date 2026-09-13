import { useLatestGameByRoom, useGameResultQuery } from "./game/use-games";

export function useGameResult(roomId: string | undefined) {
  const latestGameQuery = useLatestGameByRoom(roomId);
  const gameId = latestGameQuery.data?.gameId;
  const resultQuery = useGameResultQuery(gameId);

  return {
    isPending: latestGameQuery.isPending || (Boolean(gameId) && resultQuery.isPending),
    error: latestGameQuery.error ?? resultQuery.error,
    data: resultQuery.data,
    refetch: resultQuery.refetch,
  };
}
