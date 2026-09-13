import { Medal } from "lucide-react";
import type { GameRanking } from "../../types/result";

interface FinalRankingSectionProps {
  ranking: GameRanking[];
  evaluationComplete: boolean;
}

export function FinalRankingSection({
  ranking,
  evaluationComplete,
}: FinalRankingSectionProps) {
  return (
    <section aria-labelledby="result-ranking">
      <h2 id="result-ranking" className="text-base font-black text-[#342953]">
        최종 랭킹
      </h2>
      {!evaluationComplete ? (
        <p className="mt-3 rounded-2xl bg-[#f1eef9] p-5 text-sm text-[#8b85a8]">
          AI가 사진을 평가하고 있어요.
          <br />
          잠시 후 결과를 다시 확인해주세요.
        </p>
      ) : ranking.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-[#f1eef9] p-5 text-sm text-[#8b85a8]">
          점수와 순위는 아직 제공되지 않아요.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {ranking.map((entry) => (
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
              <p className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#342953]">
                {entry.nickname}
              </p>
              <strong className="text-lg font-black text-[#6c4cff]">
                {entry.totalScore}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
