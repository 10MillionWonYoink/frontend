import { Home, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import type { GameResult } from "../../types/result";
import { PlayerGrid } from "../room/PlayerGrid";
import { RoomSettings } from "../room/RoomSettings";
import { FinalRankingSection } from "./FinalRankingSection";
import { GameTopicSection } from "./GameTopicSection";
import { RoundResultList } from "./RoundResultList";

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
        <GameTopicSection topic={result.topic} />
        <FinalRankingSection
          ranking={result.ranking}
          evaluationComplete={result.evaluationComplete}
        />
        <RoundResultList
          turns={result.turns}
          totalTurns={result.totalTurns}
          totalRounds={room.totalRounds}
        />
        {result.turns.map((turn) => (
          <div key={turn.turnNumber}>
            {turn.imageUrl ? (
              <img
                src={turn.imageUrl}
                alt={`${turn.nickname}님의 제출 사진`}
              />
            ) : (
              <p>제출된 사진이 없습니다.</p>
            )}
          </div>
        ))}
        <PlayerGrid players={room.players} title="현재 방 참여자" />
        <RoomSettings room={room} />
        <div className="sticky bottom-0 -mx-5 mt-2 border-t border-[#eeeaf8] bg-[#fbfaff] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
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
      </div>
    </>
  );
}
