import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { Room } from "../../types/room";
import type { GameSessionState } from "../../types/game";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { FeatureNotice } from "../common/FeatureNotice";
import { RoomSettings } from "../room/RoomSettings";
import { GameTopicSection } from "../result/GameTopicSection";
import { getRoomStatusLabel } from "../../utils/get-room-status-label";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { Timer } from "./Timer";
import { CameraPreview } from "./CameraPreview";
import { useCountdown } from "../../hooks/game/use-countdown";
import { usePhotoSelection } from "../../hooks/game/use-photo-selection";
import { useUploadRoomPhoto } from "../../hooks/use-upload-room-photo.ts";

interface GameViewProps {
  room: Room;
  game: GameSessionState;
  meUserId: number | undefined;
  socketStatus: string;
  onSubmitTurn: (imageKey: string) => Promise<unknown>;
  isSubmitting: boolean;
  submitError: unknown;
}

export function GameView({
                           room,
                           game,
                           meUserId,
                           socketStatus,
                           onSubmitTurn,
                           isSubmitting,
                           submitError,
                         }: GameViewProps) {
  const currentTurn = game.currentTurn;
  const isMyTurn = Boolean(
    currentTurn && meUserId !== undefined && currentTurn.userId === meUserId,
  );
  const expiresAt = currentTurn?.expiresAt;
  const initialSeconds = useMemo(() => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }, [expiresAt]);
  const remainingSeconds = useCountdown(initialSeconds, !currentTurn);
  const { previewUrl, selectedPhoto, selectPhoto } = usePhotoSelection();
  const {
    mutateAsync: uploadMutation,
    isPending,
    isError,
    error,
  } = useUploadRoomPhoto();

  const handleSubmit = async () => {
    if (!selectedPhoto) {
      return;
    }

    // null 검사 후 File 타입으로 확정
    const photo = selectedPhoto;

    try {
      const { objectKey } =
        await uploadMutation({
          roomId: room.id,
          file: photo,
        });

      await onSubmitTurn(objectKey);

      selectPhoto(null);
    } catch (error) {
      console.error("사진 제출 실패:", error);
    }
  };

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
        <GameTopicSection topic={game.topic} />
        {game.status === "countdown" && (
          <FeatureNotice title="게임이 곧 시작해요">
            잠시 후 첫 번째 차례가 시작됩니다.
          </FeatureNotice>
        )}
        {currentTurn ? (
          <>
            <div className="flex items-center justify-between rounded-2xl bg-[#eee9ff] p-4 text-sm text-[#8b85a8]">
              <span>
                {isMyTurn ? "내 차례예요" : `${currentTurn.nickname}님의 차례`} ·{" "}
                {currentTurn.turnNumber}/{game.totalTurns}
              </span>
              <Timer seconds={remainingSeconds} />
            </div>
            {isMyTurn ? (
              <>
                {isPending && <p>업로드 중입니다.</p>}
                <CameraPreview
                  imageUrl={previewUrl}
                  isDisabled={isSubmitting}
                  onPhotoSelect={selectPhoto}
                />
                {submitError ? (
                  <p role="alert" className="text-sm text-[#d93f75]">
                    {getApiErrorMessage(submitError, "사진을 제출하지 못했습니다.")}
                  </p>
                ) : null}
                <Button
                  disabled={isPending || !selectedPhoto || isSubmitting || socketStatus !== "open"}
                  fullWidth
                  onClick={() => void handleSubmit()}
                  className="min-h-14"
                >
                  {isSubmitting ? "제출 중..." : "사진 제출하기"}
                </Button>
                {isError && (
                  <p>
                    {error instanceof Error
                      ? error.message
                      : "사진 업로드에 실패했습니다."}
                  </p>
                )}
              </>
            ) : (
              <div
                className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] bg-[#21173b] text-white/70">
                <Camera className="size-12" aria-hidden="true" />
                <p className="mt-4 text-sm font-bold">
                  {currentTurn.nickname}님이 촬영 중이에요
                </p>
                <p className="mt-2 text-xs">차례가 되면 알려드릴게요.</p>
              </div>
            )}
          </>
        ) : game.status === "finished" ? (
          <FeatureNotice title="게임이 종료되었어요">
            최종 결과를 확인해보세요.
          </FeatureNotice>
        ) : (
          <FeatureNotice title="차례를 기다리고 있어요">
            곧 다음 참여자의 차례가 시작됩니다.
          </FeatureNotice>
        )}
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
