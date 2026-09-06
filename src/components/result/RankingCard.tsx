import { Medal } from "lucide-react";
import type { Ranking } from "../../types/result";
import { Avatar } from "../common/Avatar";

interface RankingCardProps {
  ranking: Ranking;
}

const rankStyles = {
  1: "border-[#f2ca55] bg-[#fff9dd]",
  2: "border-[#c9c6d2] bg-[#f7f6fa]",
  3: "border-[#dca578] bg-[#fff1e5]",
} as const;

export function RankingCard({ ranking }: RankingCardProps) {
  const cardStyle =
    rankStyles[ranking.rank as keyof typeof rankStyles] ?? "border-[#e9e4f7] bg-white";

  return (
    <li className={`flex items-center gap-3 rounded-2xl border p-3 ${cardStyle}`}>
      <span className="grid size-7 shrink-0 place-items-center text-sm font-black text-[#6c4cff]">
        {ranking.rank <= 3 ? (
          <Medal className="size-5" aria-label={`${ranking.rank}위`} />
        ) : (
          ranking.rank
        )}
      </span>
      <Avatar imageUrl={ranking.avatar} nickname={ranking.nickname} size="small" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-[#342953]">
          {ranking.nickname}
        </p>
        <p className="truncate text-[11px] text-[#8b85a8]">
          창의성 {ranking.creativity.toFixed(1)} · {ranking.feedback}
        </p>
      </div>
      <strong className="text-lg font-black text-[#6c4cff]">{ranking.score}</strong>
    </li>
  );
}
