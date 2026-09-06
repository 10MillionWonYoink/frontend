import { Link } from "react-router-dom";
import type { RoomSummary } from "../../types/room";
import { Badge } from "../common/Badge";

interface RoomListProps {
  rooms: RoomSummary[];
}

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#dcd5ee] px-4 py-6 text-center text-xs text-[#9a94ad]">
        참여 가능한 방이 아직 없어요.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            to={`/rooms/${room.id}`}
            className="flex min-h-16 items-center justify-between rounded-2xl border border-[#e9e4f7] bg-white px-4 py-3 transition hover:border-[#b9aaf8]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[#342953]">
                {room.title}
              </p>
              <p className="mt-1 text-xs text-[#8b85a8]">
                {room.currentPlayers}/{room.maxPlayers}명 참여 중
              </p>
            </div>
            <Badge tone={room.status === "WAITING" ? "mint" : "purple"}>
              {room.status === "WAITING" ? "입장 가능" : "진행 중"}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
