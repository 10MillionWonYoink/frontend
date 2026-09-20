import type { RoomStatus } from "../types/room";

export function getRoomStatusLabel(status: RoomStatus): string {
  switch (status) {
    case "WAITING":
      return "대기 중";
    case "READY":
      return "시작 준비";
    case "PLAYING":
      return "진행 중";
    case "FINISHED":
      return "종료";
  }
}
