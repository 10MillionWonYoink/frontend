import { Home, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import type { GameResult, GameResultTurn } from "../../types/result";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";
import { PlayerGrid } from "../room/PlayerGrid";
import { RoomSettings } from "../room/RoomSettings";

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

export function ResultView({ room, result }: { room: Room; result: GameResult }) {
  return (
    <>
      <header className="bg-gradient-to-br from-[#2d214d] via-[#5c42bc] to-[#a55be5] px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-center text-white">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/15">
          <Trophy className="size-8 text-[#ffe275]" aria-hidden="true" />
        </span>
        <p className="mt-4 text-xs font-extrabold text-white/70">PHOTO RELAY</p>
        <h1 className="mt-1 text-2xl font-black">게임 결과</h1>
        <p className="mt-2 break-words text-sm text-white/80">
          {result.roomTitle ?? room.title}
        </p>
      </header>
      <div className="-mt-3 flex-1 space-y-5 rounded-t-3xl bg-[#fbfaff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <section aria-labelledby="result-photos">
          <h2 id="result-photos" className="text-base font-black text-[#342953]">
            우리의 사진 릴레이
          </h2>
          <ul className="mt-3 space-y-2">
            {result.turns.map((turn) => (
              <li
                key={turn.turnNumber}
                className="flex items-center gap-3 rounded-2xl border border-[#e9e4f7] bg-white p-3"
              >
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
                <Badge tone={turnBadgeTone(turn.status)}>
                  {TURN_STATUS_LABEL[turn.status]}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-[#8b85a8]">
            사진 보기 기능은 준비 중이에요. 지금은 제출 여부만 확인할 수 있어요.
          </p>
        </section>
        <PlayerGrid players={room.players} title="현재 방 참여자" />
        <RoomSettings room={room} />
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/rooms/${room.id}`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#ded8f2] bg-white text-sm font-bold text-[#3d335c]"
          >
            방 정보 보기
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-[#6c4cff] text-sm font-bold text-white"
          >
            <Home className="size-4" aria-hidden="true" />
            홈으로
          </Link>
        </div>
      </div>
    </>
  );
}
