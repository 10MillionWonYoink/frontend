import { useRoom } from "./room/use-rooms";

// The existing detail response only provides room metadata, not results or photos.
export function useResultRoom(roomId: string | undefined) {
  return useRoom(roomId);
}
