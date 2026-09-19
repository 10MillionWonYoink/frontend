import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import type { GameResult } from "../../types/result";
import { PlayerGrid } from "../room/PlayerGrid";
import { RoomSettings } from "../room/RoomSettings";
import { FinalRankingSection } from "./FinalRankingSection";
import { RoundResultList } from "./RoundResultList";

export function ResultView({ room, result }: { room: Room; result: GameResult }) {
  return (
    <div className="flex-1 space-y-5 bg-[#fbfaff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <FinalRankingSection
          ranking={result.ranking}
          turns={result.turns}
          totalTurns={result.totalTurns}
          totalRounds={room.totalRounds}
          evaluationComplete={result.evaluationComplete}
        />
        <RoundResultList
          turns={result.turns}
          totalTurns={result.totalTurns}
          totalRounds={room.totalRounds}
          evaluationComplete={result.evaluationComplete}
        />
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
  );
}
