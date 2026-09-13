import { ArrowUpRight, Users } from "lucide-react";
import type { RoomSummary } from "../../types/room";
import { Badge } from "../common/Badge";
import { getRoomStatusLabel } from "../../utils/get-room-status-label";

interface RoomListProps {
  rooms: RoomSummary[];
  onJoin: (roomId: number) => void;
  joinedIds: ReadonlySet<number>;
  pendingRoomId?: number;
  disabled?: boolean;
}

export function RoomList({
  rooms,
  onJoin,
  joinedIds,
  pendingRoomId,
  disabled,
}: RoomListProps) {
  if (!rooms.length)
    return (
      <p className="rounded-2xl border border-dashed border-[#dcd5ee] px-4 py-8 text-center text-sm text-[#8b85a8]">
        참여 가능한 방이 아직 없어요.
        <br />
        <span className="mt-1 inline-block text-xs">
          새 게임방을 만들어 친구를 초대해보세요.
        </span>
      </p>
    );
  return (
    <ul className="space-y-3">
      {rooms.map((room, index) => {
        const isJoined = joinedIds.has(room.id);
        const isAvailable =
          room.status === "WAITING" && room.currentPlayers < room.maxPlayers;
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => onJoin(room.id)}
              disabled={disabled || (!isJoined && !isAvailable)}
              className="flex min-h-20 w-full items-center justify-between gap-3 rounded-2xl border border-[#e9e4f7] bg-white p-4 text-left transition hover:border-[#b9aaf8] disabled:opacity-60"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-extrabold text-[#342953]">
                    {room.title}
                  </p>
                  {index === 0 && <Badge tone="pink">NEW</Badge>}
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-[#8b85a8]">
                  <Users className="size-3.5" aria-hidden="true" />
                  {room.currentPlayers} / {room.maxPlayers}명
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge tone={isAvailable ? "mint" : "purple"}>
                  {getRoomStatusLabel(room.status)}
                </Badge>
                <span className="flex items-center gap-1 text-xs font-bold text-[#6c4cff]">
                  {pendingRoomId === room.id
                    ? "입장 중..."
                    : isJoined
                      ? "돌아가기"
                      : "참여하기"}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
