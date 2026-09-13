import { useRoom } from "./room/use-rooms";

export function useResultRoom(roomId: string | undefined) {
  return useRoom(roomId);
}
