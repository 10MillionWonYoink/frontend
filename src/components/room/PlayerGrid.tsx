import { useId } from "react";
import type { RoomPlayer } from "../../types/room";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";

interface PlayerGridProps {
  players: RoomPlayer[];
  title?: string;
}

export function PlayerGrid({ players, title = "참여자" }: PlayerGridProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="mb-3 text-base font-black text-[#342953]">
        {title} ({players.length}명)
      </h2>
      <ul className="grid grid-cols-2 gap-2.5">
        {players.map((player) => (
          <li
            key={player.id}
            className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#e9e4f7] bg-white p-3"
          >
            <Avatar imageUrl={player.avatar} nickname={player.nickname} size="small" />
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-[#342953]">
                {player.nickname}
              </p>
              <Badge
                tone={player.isHost ? "yellow" : player.isReady ? "mint" : "purple"}
              >
                {player.isHost
                  ? player.isReady
                    ? "방장 · 준비 완료"
                    : "방장"
                  : player.isReady
                    ? "준비 완료"
                    : "대기 중"}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
