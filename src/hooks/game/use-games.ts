import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getLatestGameByRoom, getGameSession, getMyGameHistory } from "../../api/game";
import { getGameResult } from "../../api/result";
import { isValidRoomId } from "../../utils/is-valid-room-id";

export const gameQueryKeys = {
  latestByRoom: (roomId: string) => ["games", "latest", roomId] as const,
  detail: (gameId: number) => ["games", "detail", gameId] as const,
  result: (gameId: number) => ["games", "result", gameId] as const,
  myHistory: (limit: number) => ["games", "my-history", limit] as const,
};

export function useLatestGameByRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: gameQueryKeys.latestByRoom(roomId ?? ""),
    queryFn: () => getLatestGameByRoom(Number(roomId)),
    enabled: isValidRoomId(roomId),
  });
}

export function useGameSessionQuery(
  gameId: number | undefined,
  meUserId: number | undefined,
) {
  return useQuery({
    queryKey: gameQueryKeys.detail(gameId ?? 0),
    queryFn: () => getGameSession(gameId as number),
    enabled: Boolean(gameId),
    // The turn's personal mission is generated in the background with no realtime
    // event announcing completion; poll while it's my turn and still missing.
    refetchInterval: (query) => {
      const currentTurn = query.state.data?.currentTurn;
      if (!currentTurn || meUserId === undefined) return false;
      return currentTurn.userId === meUserId && !currentTurn.topic ? 2_000 : false;
    },
  });
}

export function useGameResultQuery(gameId: number | undefined) {
  return useQuery({
    queryKey: gameQueryKeys.result(gameId ?? 0),
    queryFn: () => getGameResult(gameId as number),
    enabled: Boolean(gameId),
    // No realtime event announces when AI evaluation finishes; poll until it does.
    refetchInterval: (query) =>
      query.state.data?.evaluationComplete === false ? 5_000 : false,
  });
}

export function useMyGameHistory(limit: number) {
  return useInfiniteQuery({
    queryKey: gameQueryKeys.myHistory(limit),
    queryFn: ({ pageParam }) => getMyGameHistory({ limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.games.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });
}
