import { Camera, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { FeatureNotice } from "../common/FeatureNotice";
import { RoomSettings } from "../room/RoomSettings";
import { getRoomStatusLabel } from "../../utils/get-room-status-label";

export function GameView({ room }: { room: Room }) {
  return (
    <>
      <header className="border-b border-[#eeeaf8] bg-white px-5 pb-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          to={`/rooms/${room.id}`}
          className="inline-flex min-h-10 items-center text-xs font-bold text-[#6c4cff]"
        >
          ← 방 정보로
        </Link>
        <div className="mt-2 flex items-center justify-between gap-3">
          <h1 className="min-w-0 break-words text-xl font-black text-[#342953]">
            {room.title}
          </h1>
          <Badge>{getRoomStatusLabel(room.status)}</Badge>
        </div>
      </header>
      <div className="flex-1 space-y-4 px-5 py-5">
        <FeatureNotice title="게임 진행 기능을 준비하고 있어요">
          아직 게임을 시작하거나 사진을 제출할 수 없어요. 방 설정과 참여자는 대기방에서
          확인할 수 있어요.
        </FeatureNotice>
        <div className="flex items-center justify-between rounded-2xl bg-[#eee9ff] p-4 text-sm text-[#8b85a8]">
          <span>현재 차례 · 확인 대기</span>
          <span className="flex items-center gap-1">
            <Clock3 className="size-4" aria-hidden="true" />
            --:--
          </span>
        </div>
        <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] bg-[#21173b] text-white/70">
          <Camera className="size-12" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold">사진 릴레이 준비 중</p>
          <p className="mt-2 text-xs">게임이 시작되면 촬영할 수 있어요.</p>
        </div>
        <Button disabled fullWidth className="min-h-14">
          사진 제출 준비 중
        </Button>
        <RoomSettings room={room} />
        {room.status === "FINISHED" && (
          <Link
            to={`/rooms/${room.id}/result`}
            className="block rounded-2xl bg-[#eee9ff] p-4 text-center text-sm font-bold text-[#6c4cff]"
          >
            결과 화면으로
          </Link>
        )}
      </div>
    </>
  );
}
