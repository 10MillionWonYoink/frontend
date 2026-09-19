import { ChevronDown, Medal } from "lucide-react";
import type { GameRanking, GameResultTurn } from "../../types/result";

interface FinalRankingSectionProps {
  ranking: GameRanking[];
  turns: GameResultTurn[];
  totalTurns: number;
  totalRounds: number;
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

interface RoundAverage {
  round: number;
  average: number;
}

// Groups each user's own evaluated turns by round (same round math as
// RoundResultList's groupTurnsByRound, so "1R"/"2R" line up with the round
// numbers shown below) and averages their real scores within that round —
// purely a display breakdown, never fed back into the backend's own ranking.
function computeRoundAverages(
  turns: GameResultTurn[],
  totalTurns: number,
  totalRounds: number,
): Map<number, RoundAverage[]> {
  const playersPerRound =
    totalRounds > 0 && totalTurns > 0
      ? Math.max(1, Math.round(totalTurns / totalRounds))
      : totalTurns || 1;

  const byUser = new Map<number, Map<number, { sum: number; count: number }>>();

  for (const turn of turns) {
    if (turn.score === null) continue;

    const round = Math.ceil(turn.turnNumber / playersPerRound);
    const userRounds = byUser.get(turn.userId) ?? new Map();
    const entry = userRounds.get(round) ?? { sum: 0, count: 0 };

    entry.sum += turn.score;
    entry.count += 1;
    userRounds.set(round, entry);
    byUser.set(turn.userId, userRounds);
  }

  const result = new Map<number, RoundAverage[]>();

  for (const [userId, rounds] of byUser) {
    const list = Array.from(rounds.entries())
      .sort(([a], [b]) => a - b)
      .map(([round, { sum, count }]) => ({
        round,
        average: Math.round(sum / count),
      }));

    result.set(userId, list);
  }

  return result;
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
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4f2f9] text-xs font-black text-[#8b85a8]">
        {rank}위
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-black ${TOP_RANK_STYLE[rank]}`}
    >
      <Medal className="size-3.5" aria-hidden="true" />
      {rank}위
    </span>
  );
}

export function FinalRankingSection({
  ranking,
  turns,
  totalTurns,
  totalRounds,
  evaluationComplete,
}: FinalRankingSectionProps) {
  const submissionCounts = countSubmissions(turns);
  const roundAverages = computeRoundAverages(turns, totalTurns, totalRounds);

  return (
    <details className="group/ranking" open>
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-2"
        aria-labelledby="result-ranking"
      >
        <h2 id="result-ranking" className="text-base font-black text-[#342953]">
          최종 랭킹
        </h2>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-[#eee9ff] px-2.5 py-1 text-[11px] font-bold text-[#6c4cff]">
            참가자 {ranking.length}명
          </span>
          <ChevronDown
            className="size-4 text-[#8b85a8] transition-transform group-open/ranking:rotate-180"
            aria-hidden="true"
          />
        </span>
      </summary>
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
        <ul className="mt-3 divide-y divide-[#f0edf7] overflow-hidden rounded-2xl border border-[#e9e4f7] bg-white">
          {ranking.map((entry) => {
            const submitted = submissionCounts.get(entry.userId) ?? 0;
            const rounds = roundAverages.get(entry.userId) ?? [];

            return (
              <li key={entry.userId} className="px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <RankBadge rank={entry.rank} />
                    <p className="min-w-0 truncate text-sm font-extrabold text-[#342953]">
                      {entry.nickname}
                    </p>
                  </div>
                  <p className="shrink-0">
                    <span className="text-lg font-black text-[#6c4cff]">
                      {entry.totalScore}
                    </span>
                    <span className="text-xs font-bold text-[#8b85a8]"> / 100점</span>
                  </p>
                </div>
                <p className="mt-1 text-[11px] text-[#a89fc2]">
                  {submitted > 0
                    ? `${submitted}장 제출 · 평균 점수`
                    : "제출한 사진 없음"}
                </p>
                {rounds.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {rounds.map(({ round, average }) => (
                      <span
                        key={round}
                        className="rounded-md bg-[#f4f2f9] px-1.5 py-0.5 text-[10px] font-bold text-[#8b85a8]"
                      >
                        {round}R {average}점
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </details>
  );
}
