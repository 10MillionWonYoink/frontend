import { ChevronDown } from "lucide-react";
import type { GameResultTurn } from "../../types/result";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";
import { useState } from "react";
import { ImagePreviewModal, type PreviewImage } from "../common/ImagePreviewModal.tsx";

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

interface ScoreBreakdown {
  relevance: number;
  expression: number;
  creativity: number;
}

// Backend's aiFeedback packs the 세부 점수 into the tail of the sentence, e.g.
// "표현이 좋아요 (주제 적합성 14/50, 표현력 9/30, 창의성 6/20)". No separate API field
// exists for these, so this pulls them back out for display without touching the
// feedback text's own storage/shape. Falls back to showing the raw text untouched
// if it doesn't match (e.g. older data), rather than hiding or guessing at it.
const SCORE_BREAKDOWN_PATTERN =
  /\s*\(주제 적합성 (\d+)\/50, 표현력 (\d+)\/30, 창의성 (\d+)\/20\)\s*$/;

function parseAiFeedback(feedback: string): {
  summary: string;
  breakdown: ScoreBreakdown | null;
} {
  const match = feedback.match(SCORE_BREAKDOWN_PATTERN);

  if (!match) return { summary: feedback, breakdown: null };

  return {
    summary: feedback.slice(0, match.index).trim(),
    breakdown: {
      relevance: Number(match[1]),
      expression: Number(match[2]),
      creativity: Number(match[3]),
    },
  };
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
  evaluationComplete: boolean;
}

export function RoundResultList({
                                  turns,
                                  totalTurns,
                                  totalRounds,
                                  evaluationComplete,
                                }: RoundResultListProps) {
  const groups = groupTurnsByRound(turns, totalTurns, totalRounds);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);

  return (
    <>
      <section aria-labelledby="result-photos">
        <h2
          id="result-photos"
          className="text-base font-black text-[#342953]"
        >
          우리의 사진 릴레이
        </h2>

        <div className="mt-4 space-y-6">
          {groups.map((group) => {
            const submittedCount = group.turns.filter(
              (turn) => turn.status === "submitted",
            ).length;

            return (
              <details
                key={group.round}
                className="group/round"
                open={group.round === 1}
              >
                {/* 라운드 제목 (클릭해서 개별 접기/펼치기, 여러 라운드 동시에 펼침 가능) */}
                <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[#6c4cff]" />

                    <h3
                      id={`round-${group.round}`}
                      className="text-sm font-black text-[#342953]"
                    >
                      {group.round}라운드
                    </h3>
                  </div>

                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-[#eee9ff] px-2.5 py-1 text-[11px] font-bold text-[#6c4cff]">
                      제출 {submittedCount}/{group.turns.length}
                    </span>
                    <ChevronDown
                      className="size-4 text-[#8b85a8] transition-transform group-open/round:rotate-180"
                      aria-hidden="true"
                    />
                  </span>
                </summary>

                <ul
                  className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {group.turns.map((turn) => (
                    <li
                      key={turn.turnNumber}
                      className="w-[82vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-3xl border border-[#e9e4f7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[320px]"
                    >
                      {/* 제출 사진 */}
                      {turn.imageUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImage({
                              src: turn.imageUrl!,
                              alt: `${turn.nickname}님의 ${turn.turnNumber}번째 제출 사진`,
                              caption: `${turn.turnNumber}턴 · ${turn.nickname}`,
                            })
                          }
                          className="group/image relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#17131f] text-left focus:outline-none focus:ring-2 focus:ring-[#6c4cff] focus:ring-inset"
                          aria-label={`${turn.nickname}님의 제출 사진 크게 보기`}
                        >
                          {/* 흐린 배경 이미지 */}
                          <img
                            src={turn.imageUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl"
                          />

                          {/* 실제 이미지 */}
                          <img
                            src={turn.imageUrl}
                            alt={`${turn.nickname}님의 ${turn.turnNumber}번째 제출 사진`}
                            loading="lazy"
                            className="relative z-10 size-full object-contain transition-transform duration-300 group-hover/image:scale-[1.03]"
                          />

                          <span
                            className="absolute left-3 top-3 z-20 rounded-full bg-black/55 px-3 py-1.5 text-xs font-black text-white backdrop-blur-sm">
                          TURN {turn.turnNumber}
                        </span>

                          {turn.score !== null && (
                            <span
                              className="absolute right-3 top-3 z-20 rounded-full bg-[#6c4cff]/90 px-3 py-1.5 text-xs font-black text-white shadow-sm backdrop-blur-sm">
                            {turn.score}점
                          </span>
                          )}

                          {/* 마우스를 올렸을 때 크게 보기 안내 */}
                          <span
                            className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover/image:opacity-100">
                          클릭해서 크게 보기
                        </span>
                        </button>
                      ) : (
                        // 기존 사진 없음 UI
                        <div className="relative grid aspect-[4/3] place-items-center bg-[#f5f2fb]">
                        <span
                          className="absolute left-3 top-3 rounded-full bg-[#ded8ec] px-3 py-1.5 text-xs font-black text-[#756e8d]">
                          TURN {turn.turnNumber}
                        </span>

                          <p className="text-sm font-extrabold text-[#8b85a8]">
                            제출된 사진이 없습니다
                          </p>
                        </div>
                      )}

                      {/* 사용자 및 제출 정보 */}
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            imageUrl={turn.profileImageUrl}
                            nickname={turn.nickname}
                            size="small"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold text-[#342953]">
                              {turn.nickname}
                            </p>

                            <p className="text-[11px] text-[#8b85a8]">
                              {turn.submittedAt
                                ? new Date(turn.submittedAt).toLocaleTimeString(
                                  "ko-KR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                                : "제출 시간 없음"}
                            </p>
                          </div>

                          <Badge tone={turnBadgeTone(turn.status)}>
                            {TURN_STATUS_LABEL[turn.status]}
                          </Badge>
                        </div>

                        {turn.topic && (
                          <div className="mt-3 rounded-2xl bg-[#eee9ff] px-3 py-2.5">
                            <p className="text-[10px] font-extrabold text-[#8f79ef]">
                              이번 미션
                            </p>

                            <p className="mt-0.5 text-sm font-bold text-[#6c4cff]">
                              {turn.topic}
                            </p>
                          </div>
                        )}

                        {turn.score !== null && (() => {
                          const { summary, breakdown } = turn.feedback
                            ? parseAiFeedback(turn.feedback)
                            : { summary: "", breakdown: null };

                          return (
                            <div className="mt-3 rounded-2xl bg-[#f4f2f9] px-3 py-3">
                              {/* 총점 */}
                              <p className="text-[10px] font-extrabold text-[#8b85a8]">
                                총점
                              </p>
                              <p className="mt-0.5">
                                <span className="text-2xl font-black text-[#6c4cff]">
                                  {turn.score}
                                </span>
                                <span className="text-sm font-bold text-[#8b85a8]">
                                  {" "}
                                  / 100점
                                </span>
                              </p>

                              {/* 총평 */}
                              {summary && (
                                <div className="mt-2.5 border-t border-[#e5e1ee] pt-2.5">
                                  <p className="text-[10px] font-extrabold text-[#8b85a8]">
                                    총평
                                  </p>
                                  <p className="mt-0.5 whitespace-pre-line text-xs leading-5 text-[#625b79]">
                                    {summary}
                                  </p>
                                </div>
                              )}

                              {/* 세부 평가 */}
                              {breakdown && (
                                <div className="mt-2.5 grid grid-cols-3 gap-2 border-t border-[#e5e1ee] pt-2.5">
                                  <ScoreDetail
                                    label="주제 적합성"
                                    value={breakdown.relevance}
                                    max={50}
                                  />
                                  <ScoreDetail
                                    label="표현력"
                                    value={breakdown.expression}
                                    max={30}
                                  />
                                  <ScoreDetail
                                    label="창의성"
                                    value={breakdown.creativity}
                                    max={20}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* 제출은 했지만 아직 점수가 없는 경우: 미제출과 혼동되지 않도록
                            "평가 중"과 "평가 실패"를 구분해서 보여준다. 게임 전체 평가가
                            끝나기 전까지는 순서를 기다리는 중일 수 있으므로 실패로 단정하지 않는다. */}
                        {turn.status === "submitted" && turn.score === null && (
                          <p
                            className={`mt-2 text-xs font-bold ${
                              evaluationComplete ? "text-[#d93f75]" : "text-[#8b85a8]"
                            }`}
                          >
                            {evaluationComplete
                              ? "AI 평가에 실패했어요"
                              : "AI가 평가하고 있어요..."}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}

// Backend's per-item scoring stays on its original scale (50/30/20); this only
// converts the DISPLAYED number to a 100-point scale for readability. The
// authoritative 총점 (turn.score) is never recomputed from this.
function ScoreDetail({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const normalized = Math.round((value / max) * 100);

  return (
    <div className="rounded-xl bg-white px-2 py-2 text-center">
      <p className="text-[9px] font-extrabold text-[#8b85a8]">{label}</p>
      <p className="mt-0.5 text-sm font-black text-[#342953]">
        {normalized}
        <span className="text-[10px] font-bold text-[#8b85a8]"> / 100점</span>
      </p>
    </div>
  );
}
