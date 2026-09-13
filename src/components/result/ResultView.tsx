import { Home, Images, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import { FeatureNotice } from "../common/FeatureNotice";
import { PlayerGrid } from "../room/PlayerGrid";
import { RoomSettings } from "../room/RoomSettings";

export function ResultView({ room }: { room: Room }) {
  return (
    <>
      <header className="bg-gradient-to-br from-[#2d214d] via-[#5c42bc] to-[#a55be5] px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-center text-white">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/15">
          <Trophy className="size-8 text-[#ffe275]" aria-hidden="true" />
        </span>
        <p className="mt-4 text-xs font-extrabold text-white/70">PHOTO RELAY</p>
        <h1 className="mt-1 text-2xl font-black">게임 결과</h1>
        <p className="mt-2 break-words text-sm text-white/80">{room.title}</p>
      </header>
      <div className="-mt-3 flex-1 space-y-5 rounded-t-3xl bg-[#fbfaff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <FeatureNotice title="결과 보기를 준비하고 있어요">
          {room.status === "FINISHED"
            ? "게임은 종료되었어요. "
            : "아직 종료된 게임 결과를 볼 수 없어요. "}
          사진과 최종 결과는 기능이 준비되면 확인할 수 있어요.
        </FeatureNotice>
        <section aria-labelledby="result-photos">
          <h2 id="result-photos" className="text-base font-black text-[#342953]">
            우리의 사진 릴레이
          </h2>
          <div className="mt-3 flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcd5ee] text-[#8b85a8]">
            <Images className="size-8 text-[#b9aaf8]" aria-hidden="true" />
            <p className="mt-3 text-sm">아직 불러올 수 있는 사진이 없어요.</p>
          </div>
        </section>
        <section aria-labelledby="result-ranking">
          <h2 id="result-ranking" className="text-base font-black text-[#342953]">
            최종 랭킹
          </h2>
          <p className="mt-3 rounded-2xl bg-[#f1eef9] p-5 text-sm text-[#8b85a8]">
            점수와 순위는 아직 제공되지 않아요.
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
