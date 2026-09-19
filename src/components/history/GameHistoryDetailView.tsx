import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { GameResult } from "../../types/result";
import { FinalRankingSection } from "../result/FinalRankingSection";
import { RoundResultList } from "../result/RoundResultList";

export function GameHistoryDetailView({ result }: { result: GameResult }) {
  // GameResult에는 room의 현재 relayCount(=totalRounds)가 내려오지 않지만, 백엔드가
  // totalTurns를 "게임 시작 시 참여자 수 × relayCount"로 고정 저장하므로
  // ranking.length(그 게임의 실제 참여자 수)로 나누면 그 게임 당시의 라운드 수를
  // 그대로 복원할 수 있다 — 새로운 값을 추정/생성하는 것이 아니라 이미 있는 두
  // 필드로부터 정확히 역산하는 것.
  const totalRounds =
    result.ranking.length > 0
      ? Math.round(result.totalTurns / result.ranking.length)
      : 0;

  return (
    <div className="flex-1 space-y-5 bg-[#fbfaff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Link
        to="/history"
        className="inline-flex items-center gap-1 text-xs font-bold text-[#8b85a8]"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        내 게임 기록
      </Link>
      <div>
        <p className="text-lg font-black text-[#342953]">
          {result.roomTitle ?? "이름 없는 방"}
        </p>
        {result.finishedAt && (
          <p className="mt-1 text-xs text-[#8b85a8]">
            {new Date(result.finishedAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
      <FinalRankingSection
        ranking={result.ranking}
        turns={result.turns}
        totalTurns={result.totalTurns}
        totalRounds={totalRounds}
        evaluationComplete={result.evaluationComplete}
      />
      <RoundResultList
        turns={result.turns}
        totalTurns={result.totalTurns}
        totalRounds={totalRounds}
        evaluationComplete={result.evaluationComplete}
      />
    </div>
  );
}
