import { useGameRoom } from "./use-game-state";

// TODO: connect server-authoritative deadlines, turns and photo submission once exposed.
export function useGameSession(roomId: string) {
  const roomQuery = useGameRoom(roomId);
  return {
    room: roomQuery.data,
    error: roomQuery.error,
    isPending: roomQuery.isPending,
    refetch: roomQuery.refetch,
  };
}
