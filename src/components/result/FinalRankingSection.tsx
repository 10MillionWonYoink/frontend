import { Medal } from "lucide-react";
import type { GameRanking, GameResultTurn } from "../../types/result";

interface FinalRankingSectionProps {
  ranking: GameRanking[];
  turns: GameResultTurn[];
  evaluationComplete: boolean;
}

// Derived purely from the turns already in the response (counting submissions),
// not a recalculation of any score/rank — just context for why a score looks
// the way it does (e.g. distinguishing "scored 0" from "never submitted").
function countSubmissions(turns: GameResultTurn[]): Map<number, number> {
  const counts = new Map<number, number>();

  for (const turn of turns) {
    if (turn.status !== "submitted") continue;
    counts.set(turn.userId, (counts.get(turn.userId) ?? 0) + 1);
  }

  return counts;
}

// 1~3위는 "N위" 텍스트를 항상 함께 보여줘서(아이콘만으로 구분하지 않음) 색만으로
// 순위를 추측하지 않게 하고, 같은 보라색 계열 안에서 진하기로 1>2>3위를 차등 표현한다.
// 4위 이후는 메달 없이 숫자 순위만 사용.
const TOP_RANK_STYLE: Record<number, string> = {
  1: "bg-[#6c4cff] text-white",
  2: "bg-[#c9bdfb] text-[#3d2894]",
  3: "bg-[#e6e0fb] text-[#5638d1]",
};

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4f2f9] text-sm font-black text-[#8b85a8]">
        {rank}위
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-xs font-black ${TOP_RANK_STYLE[rank]}`}
    >
      <Medal className="size-3.5" aria-hidden="true" />
      {rank}위
    </span>
  );
}

export function FinalRankingSection({
  ranking,
  turns,
  evaluationComplete,
}: FinalRankingSectionProps) {
  const submissionCounts = countSubmissions(turns);

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
          {ranking.map((entry) => {
            const submitted = submissionCounts.get(entry.userId) ?? 0;

            return (
              <li
                key={entry.userId}
                className="flex items-center gap-3 rounded-2xl border border-[#e9e4f7] bg-white p-3"
              >
                <RankBadge rank={entry.rank} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-[#342953]">
                    {entry.nickname}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#a89fc2]">
                    {submitted > 0
                      ? `${submitted}장 제출 · 평균 ${entry.totalScore}점`
                      : "제출한 사진 없음"}
                  </p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-lg font-black text-[#6c4cff]">
                    {entry.totalScore}
                  </span>
                  <span className="text-xs font-bold text-[#8b85a8]"> / 100점</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
