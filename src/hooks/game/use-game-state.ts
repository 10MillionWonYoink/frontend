import { useRoom } from "../room/use-rooms";

export function useGameRoom(roomId: string | undefined) {
  return useRoom(roomId);
}
