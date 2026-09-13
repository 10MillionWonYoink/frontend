import { useQuery } from "@tanstack/react-query";
import { getLatestGameByRoom, getGameSession } from "../../api/game";
import { getGameResult } from "../../api/result";
import { isValidRoomId } from "../../utils/is-valid-room-id";

export const gameQueryKeys = {
  latestByRoom: (roomId: string) => ["games", "latest", roomId] as const,
  detail: (gameId: number) => ["games", "detail", gameId] as const,
  result: (gameId: number) => ["games", "result", gameId] as const,
};

export function useLatestGameByRoom(roomId: string | undefined) {
  return useQuery({
    queryKey: gameQueryKeys.latestByRoom(roomId ?? ""),
    queryFn: () => getLatestGameByRoom(Number(roomId)),
    enabled: isValidRoomId(roomId),
  });
}

export function useGameSessionQuery(gameId: number | undefined) {
  return useQuery({
    queryKey: gameQueryKeys.detail(gameId ?? 0),
    queryFn: () => getGameSession(gameId as number),
    enabled: Boolean(gameId),
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
