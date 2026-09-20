import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { GameHistoryItem } from "../../types/result";
import { Avatar } from "../common/Avatar";
import { RankBadge } from "../common/RankBadge";

function formatPlayedAt(finishedAt: string): string {
  return new Date(finishedAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface GameHistoryListProps {
  games: GameHistoryItem[];
}

export function GameHistoryList({ games }: GameHistoryListProps) {
  if (!games.length)
    return (
      <p className="rounded-2xl border border-dashed border-[#dcd5ee] px-4 py-8 text-center text-sm text-[#8b85a8]">
        아직 완료한 게임이 없어요.
        <br />
        <span className="mt-1 inline-block text-xs">
          친구들과 첫 포토 릴레이를 시작해보세요.
        </span>
      </p>
    );

  return (
    <ul className="space-y-3">
      {games.map((game) => (
        <li key={game.gameId}>
          <Link
            to={`/games/${game.gameId}/result`}
            className="block rounded-2xl border border-[#e9e4f7] bg-white p-4 transition hover:border-[#b9aaf8]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-[#342953]">
                  {game.roomTitle ?? "이름 없는 방"}
                </p>
                <p className="mt-1 text-[11px] text-[#8b85a8]">
                  {formatPlayedAt(game.finishedAt)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#6c4cff]">
                결과 보기
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <RankBadge rank={game.myRank} />
                <p className="text-sm">
                  <span className="text-base font-black text-[#6c4cff]">
                    {game.myScore}
                  </span>
                  <span className="text-xs font-bold text-[#8b85a8]"> / 100점</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {game.participants.slice(0, 4).map((participant) => (
                    <Avatar
                      key={participant.userId}
                      imageUrl={participant.profileImageUrl}
                      nickname={participant.nickname}
                      size="small"
                    />
                  ))}
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#8b85a8]">
                  <Users className="size-3" aria-hidden="true" />
                  {game.participants.length}명
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
