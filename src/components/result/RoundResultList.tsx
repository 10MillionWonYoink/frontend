import { ChevronDown } from "lucide-react";
import type { GameResultTurn } from "../../types/result";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";

const TURN_STATUS_LABEL: Record<GameResultTurn["status"], string> = {
  submitted: "제출 완료",
  expired: "시간 초과",
  waiting: "진행 안 함",
  in_progress: "진행 안 함",
};

function turnBadgeTone(status: GameResultTurn["status"]): "mint" | "pink" | "purple" {
  if (status === "submitted") return "mint";
  if (status === "expired") return "pink";
  return "purple";
}

// This is a UI-only shape for when Backend eventually provides per-turn AI
// scoring/feedback — it is not part of the current GameResultTurn API contract.
export interface TurnInsight {
  score?: number;
  feedback?: string;
}

interface RoundGroup {
  round: number;
  turns: GameResultTurn[];
}

// totalTurns/totalRounds are both real API fields (GameResult.totalTurns, Room.totalRounds);
// this just derives which round each turn belongs to, no data is invented.
function groupTurnsByRound(
  turns: GameResultTurn[],
  totalTurns: number,
  totalRounds: number,
): RoundGroup[] {
  if (totalRounds <= 0 || totalTurns <= 0) return [{ round: 1, turns }];
  const playersPerRound = Math.max(1, Math.round(totalTurns / totalRounds));
  const groups = new Map<number, GameResultTurn[]>();
  for (const turn of turns) {
    const round = Math.ceil(turn.turnNumber / playersPerRound);
    const roundTurns = groups.get(round) ?? [];
    roundTurns.push(turn);
    groups.set(round, roundTurns);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([round, roundTurns]) => ({ round, turns: roundTurns }));
}

interface RoundResultListProps {
  turns: GameResultTurn[];
  totalTurns: number;
  totalRounds: number;
  // Keyed by turnNumber. Absent/empty today since Backend doesn't provide this yet.
  turnInsights?: Record<number, TurnInsight>;
}

export function RoundResultList({
  turns,
  totalTurns,
  totalRounds,
  turnInsights,
}: RoundResultListProps) {
  const groups = groupTurnsByRound(turns, totalTurns, totalRounds);

  return (
    <section aria-labelledby="result-photos">
      <h2 id="result-photos" className="text-base font-black text-[#342953]">
        우리의 사진 릴레이
      </h2>
      <div className="mt-3 space-y-2">
        {groups.map((group) => {
          const submittedCount = group.turns.filter(
            (turn) => turn.status === "submitted",
          ).length;
          return (
            <details
              key={group.round}
              className="group rounded-2xl border border-[#e9e4f7] bg-white"
              open={group.round === 1}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-extrabold text-[#342953]">
                <span>{group.round}라운드</span>
                <span className="flex items-center gap-2 text-xs font-bold text-[#8b85a8]">
                  제출 {submittedCount}/{group.turns.length}
                  <ChevronDown
                    className="size-4 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <ul className="space-y-2 border-t border-[#eeeaf8] p-3 pt-2">
                {group.turns.map((turn) => {
                  const insight = turnInsights?.[turn.turnNumber];
                  return (
                    <li
                      key={turn.turnNumber}
                      className="rounded-2xl border border-[#e9e4f7] bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center text-sm font-black text-[#6c4cff]">
                          {turn.turnNumber}
                        </span>
                        <Avatar
                          imageUrl={turn.profileImageUrl}
                          nickname={turn.nickname}
                          size="small"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold text-[#342953]">
                            {turn.nickname}
                          </p>
                          <p className="truncate text-[11px] text-[#8b85a8]">
                            {turn.submittedAt
                              ? new Date(turn.submittedAt).toLocaleTimeString("ko-KR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </p>
                        </div>
                        {insight?.score !== undefined && (
                          <strong className="text-sm font-black text-[#6c4cff]">
                            {insight.score}점
                          </strong>
                        )}
                        <Badge tone={turnBadgeTone(turn.status)}>
                          {TURN_STATUS_LABEL[turn.status]}
                        </Badge>
                      </div>
                      {insight?.feedback && (
                        <p className="mt-2 rounded-xl bg-[#f1eef9] px-3 py-2 text-[11px] text-[#8b85a8]">
                          {insight.feedback}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[#8b85a8]">
        사진 보기 기능은 준비 중이에요. 지금은 제출 여부만 확인할 수 있어요.
      </p>
    </section>
  );
}
