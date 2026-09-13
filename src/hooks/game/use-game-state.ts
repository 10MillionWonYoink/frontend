import { useRoom } from "../room/use-rooms";

// Only room metadata is observable. This is not a game-session state endpoint.
export function useGameRoom(roomId: string | undefined) {
  return useRoom(roomId);
}
