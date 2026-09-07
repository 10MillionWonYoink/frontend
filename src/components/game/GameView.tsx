import { Send, Wifi, WifiOff } from "lucide-react";
import type { GameState } from "../../types/game";
import type { GameSocketStatus } from "../../hooks/websocket/useGameSocket";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { CameraPreview } from "./CameraPreview";
import { Timer } from "./Timer";

interface GameViewProps {
  game: GameState;
  isSubmitting: boolean;
  onPhotoSelect: (photo: File) => void;
  onSubmit: () => void;
  previewUrl: string | null;
  remainingSeconds: number;
  selectedPhoto: File | null;
  socketStatus: GameSocketStatus;
  submitErrorMessage?: string;
}

export function GameView({
  game,
  isSubmitting,
  onPhotoSelect,
  onSubmit,
  previewUrl,
  remainingSeconds,
  selectedPhoto,
  socketStatus,
  submitErrorMessage,
}: GameViewProps) {
  const hasSubmitted = game.status === "SUBMITTED";
  const canTakePhoto = game.status === "MY_TURN" && !hasSubmitted;
  const visibleImageUrl = previewUrl ?? game.submittedImageUrl;

  return (
    <>
      <header className="border-b border-[#eeeaf8] bg-white px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <Badge>
            라운드 {game.round} / {game.totalRounds}
          </Badge>
          <span className="text-xs font-bold text-[#8b85a8]">
            턴 {game.turnOrder} / {game.totalPlayers}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f0ebff] p-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[11px] text-[#8b85a8]">
              {socketStatus === "open" ? (
                <Wifi className="size-3 text-[#00a98f]" aria-label="실시간 연결됨" />
              ) : (
                <WifiOff
                  className="size-3 text-[#d93f75]"
                  aria-label="실시간 연결 중"
                />
              )}
              현재 차례
            </p>
            <strong className="block truncate text-base font-black text-[#6c4cff]">
              {canTakePhoto
                ? "🎯 내 차례예요!"
                : `${game.currentPlayerNickname}님의 차례`}
            </strong>
          </div>
          <Timer seconds={remainingSeconds} />
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <Card className="border-0 bg-gradient-to-br from-[#fff5cf] to-[#ffe2ec]">
          <p className="text-xs font-bold text-[#a3781a]">
            {game.missionEmoji} 이번 미션
          </p>
          <h1 className="mt-1 text-xl font-black tracking-[-0.02em] text-[#342953]">
            {game.mission}
          </h1>
          <p className="mt-1 text-xs text-[#8b85a8]">
            창의적일수록 높은 점수를 받아요 ✨
          </p>
        </Card>

        <CameraPreview
          imageUrl={visibleImageUrl}
          isDisabled={!canTakePhoto || isSubmitting}
          onPhotoSelect={onPhotoSelect}
        />

        {submitErrorMessage && (
          <p role="alert" className="text-xs font-semibold text-[#d93f75]">
            {submitErrorMessage}
          </p>
        )}

        {hasSubmitted ? (
          <div className="rounded-2xl bg-[#d8f7ef] px-4 py-4 text-center text-sm font-extrabold text-[#008d78]">
            사진 제출 완료! 다음 턴을 기다려주세요.
          </div>
        ) : (
          <Button
            fullWidth
            className="min-h-16 gap-2 text-base"
            disabled={
              !canTakePhoto || !selectedPhoto || isSubmitting || remainingSeconds === 0
            }
            onClick={onSubmit}
          >
            <Send className="size-5" aria-hidden="true" />
            {isSubmitting
              ? "사진을 제출하고 있어요..."
              : canTakePhoto
                ? "이 사진 제출하기"
                : "내 차례를 기다려주세요"}
          </Button>
        )}
      </div>
    </>
  );
}
