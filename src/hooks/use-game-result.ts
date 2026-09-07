import { useQuery } from "@tanstack/react-query";
import { getGameResult } from "../api/result";

export const resultQueryKeys = {
  detail: (roomId: string) => ["results", roomId] as const,
};

export function useGameResult(roomId: string | undefined) {
  return useQuery({
    queryKey: resultQueryKeys.detail(roomId ?? ""),
    queryFn: () => getGameResult(roomId ?? ""),
    enabled: Boolean(roomId),
  });
}
