import { Medal } from "lucide-react";
import { Avatar } from "../common/Avatar";

// This is a UI-only shape for when Backend eventually provides final scores/rankings —
// it is not part of the current GameResult API contract.
export interface RankingEntry {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  rank: number;
  score: number;
  feedback?: string;
}

interface FinalRankingSectionProps {
  rankings?: RankingEntry[];
}

export function FinalRankingSection({ rankings }: FinalRankingSectionProps) {
  return (
    <section aria-labelledby="result-ranking">
      <h2 id="result-ranking" className="text-base font-black text-[#342953]">
        최종 랭킹
      </h2>
      {!rankings || rankings.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-[#f1eef9] p-5 text-sm text-[#8b85a8]">
          점수와 순위는 아직 제공되지 않아요.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rankings.map((entry) => (
            <li
              key={entry.userId}
              className="flex items-center gap-3 rounded-2xl border border-[#e9e4f7] bg-white p-3"
            >
              <span className="grid size-7 shrink-0 place-items-center text-sm font-black text-[#6c4cff]">
                {entry.rank <= 3 ? (
                  <Medal className="size-5" aria-label={`${entry.rank}위`} />
                ) : (
                  entry.rank
                )}
              </span>
              <Avatar imageUrl={entry.profileImageUrl} nickname={entry.nickname} size="small" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-[#342953]">
                  {entry.nickname}
                </p>
                {entry.feedback && (
                  <p className="truncate text-[11px] text-[#8b85a8]">{entry.feedback}</p>
                )}
              </div>
              <strong className="text-lg font-black text-[#6c4cff]">{entry.score}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
