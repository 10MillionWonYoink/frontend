export function isValidRoomId(roomId: string | undefined): boolean {
  if (!roomId) return false;
  return /^\d+$/.test(roomId) && Number(roomId) > 0;
}
