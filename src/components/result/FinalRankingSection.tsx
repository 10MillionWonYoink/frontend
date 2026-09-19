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
        <>
          <p className="mt-1 text-[11px] text-[#8b85a8]">
            제출 사진 평균 점수 기준
          </p>
          <ul className="mt-2.5 space-y-2">
            {ranking.map((entry) => (
              <li
                key={entry.userId}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  entry.rank === 1
                    ? "border-[#f5cf7a] bg-[#fff8e8]"
                    : "border-[#e9e4f7] bg-white"
                }`}
              >
                <span className="grid size-8 shrink-0 place-items-center text-sm font-black text-[#6c4cff]">
                  {entry.rank <= 3 ? (
                    <Medal className="size-5" aria-label={`${entry.rank}위`} />
                  ) : (
                    entry.rank
                  )}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#342953]">
                  {entry.nickname}
                </p>
                <p className="shrink-0">
                  <span className="text-xl font-black text-[#6c4cff]">
                    {entry.totalScore}
                  </span>
                  <span className="text-xs font-bold text-[#8b85a8]"> / 100점</span>
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
