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
}

export function RoundResultList({
                                  turns,
                                  totalTurns,
                                  totalRounds,
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
              <section
                key={group.round}
                aria-labelledby={`round-${group.round}`}
              >
                {/* 라운드 제목 */}
                <header className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[#6c4cff]" />

                    <h3
                      id={`round-${group.round}`}
                      className="text-sm font-black text-[#342953]"
                    >
                      {group.round}라운드
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#eee9ff] px-2.5 py-1 text-[11px] font-bold text-[#6c4cff]">
              제출 {submittedCount}/{group.turns.length}
            </span>
                </header>

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

                        {turn.feedback && (
                          <div className="mt-2 rounded-2xl bg-[#f4f2f9] px-3 py-2.5">
                            <p className="text-[10px] font-extrabold text-[#8b85a8]">
                              AI 평가
                            </p>

                            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-[#625b79]">
                              {turn.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
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
