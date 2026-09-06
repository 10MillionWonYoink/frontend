import { Check, Clipboard, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import type { Room, RoomPlayer } from "../../types/room";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlayerGrid } from "./PlayerGrid";
import { RoomSettings } from "./RoomSettings";

const COPY_FEEDBACK_DURATION_MS = 1_500;

interface RoomLobbyViewProps {
  canStart: boolean;
  currentPlayer: RoomPlayer | undefined;
  isReadyUpdating: boolean;
  isStarting: boolean;
  onLeave: () => void;
  onReadyChange: (isReady: boolean) => void;
  onStart: () => void;
  room: Room;
}

export function RoomLobbyView({
  canStart,
  currentPlayer,
  isReadyUpdating,
  isStarting,
  onLeave,
  onReadyChange,
  onStart,
  room,
}: RoomLobbyViewProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timerId = window.setTimeout(
      () => setIsCopied(false),
      COPY_FEEDBACK_DURATION_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room.invitationCode);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-br from-[#6c4cff] to-[#b36bff] px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <button
          type="button"
          onClick={onLeave}
          className="min-h-10 rounded-xl bg-white/15 px-3 text-xs font-bold"
        >
          ← 나가기
        </button>
        <h1 className="mt-4 text-xl font-black tracking-[-0.02em]">{room.title}</h1>
        <p className="mt-1 text-xs text-white/75">
          방장 {room.hostName} · 최대 {room.maxPlayers}명
        </p>
      </header>

      <div className="-mt-3 flex-1 space-y-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Card className="border-0 bg-gradient-to-br from-[#fff6d8] to-[#ffe4ed]">
          <p className="text-xs font-bold text-[#8b85a8]">초대 코드</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <strong className="min-w-0 truncate text-2xl font-black tracking-[0.18em] text-[#6c4cff]">
              {room.invitationCode}
            </strong>
            <Button
              variant="ghost"
              onClick={() => void handleCopy()}
              className="min-h-10 px-3 py-2"
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Clipboard className="size-4" />
              )}
              <span className="ml-1">{isCopied ? "복사됨" : "복사"}</span>
            </Button>
          </div>
        </Card>

        <PlayerGrid players={room.players} />
        <RoomSettings room={room} />

        {currentPlayer?.isHost ? (
          <Button
            fullWidth
            disabled={!canStart || isStarting}
            onClick={onStart}
            className="min-h-14 gap-2"
          >
            <Rocket className="size-5" aria-hidden="true" />
            {isStarting
              ? "게임 시작 중..."
              : canStart
                ? "게임 시작"
                : "모두 준비하면 시작할 수 있어요"}
          </Button>
        ) : (
          <Button
            fullWidth
            variant={currentPlayer?.isReady ? "ghost" : "secondary"}
            disabled={isReadyUpdating}
            onClick={() => onReadyChange(!currentPlayer?.isReady)}
            className="min-h-14"
          >
            {currentPlayer?.isReady ? "준비 취소" : "✓ 준비하기"}
          </Button>
        )}
      </div>
    </>
  );
}
