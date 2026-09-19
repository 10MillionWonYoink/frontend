import { DoorOpen, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import type { GameResult } from "../../types/result";
import { PlayerGrid } from "../room/PlayerGrid";
import { RoomSettings } from "../room/RoomSettings";
import { FinalRankingSection } from "./FinalRankingSection";
import { RoundResultList } from "./RoundResultList";

interface ResultViewProps {
  room: Room;
  result: GameResult;
  onLeaveRoom: () => void;
  isLeavingRoom: boolean;
  leaveRoomError?: string;
}

export function ResultView({
  room,
  result,
  onLeaveRoom,
  isLeavingRoom,
  leaveRoomError,
}: ResultViewProps) {
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
        {leaveRoomError && (
          <p role="alert" className="mb-2 text-xs font-bold text-[#d93f75]">
            {leaveRoomError}
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/rooms/${room.id}`}
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-[#6c4cff] text-sm font-bold text-white"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            한 번 더 하기
          </Link>
          <button
            type="button"
            onClick={onLeaveRoom}
            disabled={isLeavingRoom}
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl border border-[#ded8f2] bg-white text-sm font-bold text-[#3d335c] disabled:opacity-50"
          >
            <DoorOpen className="size-4" aria-hidden="true" />
            {isLeavingRoom ? "나가는 중..." : "방 나가기"}
          </button>
        </div>
      </div>
    </div>
  );
}
