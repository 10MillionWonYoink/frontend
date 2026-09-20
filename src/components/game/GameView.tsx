import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";
import type { GameSessionState } from "../../types/game";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { FeatureNotice } from "../common/FeatureNotice";
import { ChatPanel } from "../chat/ChatPanel";
import { RoomSettings } from "../room/RoomSettings";
import type { RoomChatProps } from "../room/RoomLobbyView";
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
  playerLeftNotice: { nickname: string; remainingParticipants: number } | null;
  onSubmitTurn: (imageKey: string) => Promise<unknown>;
  isSubmitting: boolean;
  submitError: unknown;
  chat: RoomChatProps;
}

export function GameView({
  room,
  game,
  meUserId,
  socketStatus,
  playerLeftNotice,
  onSubmitTurn,
  isSubmitting,
  submitError,
  chat,
}: GameViewProps) {
  const currentTurn = game.currentTurn;
  const isMyTurn = Boolean(
    currentTurn && meUserId !== undefined && currentTurn.userId === meUserId,
  );
  const remainingSeconds = useCountdown(currentTurn?.expiresAt, !currentTurn);
  const { previewUrl, selectedPhoto, selectPhoto } = usePhotoSelection();
  const uploadMutation = useUploadRoomPhoto();
  // Uploading to S3 happens before the socket submit mutation even starts, so
  // isSubmitting alone doesn't cover it — without this, the button stays
  // clickable (and doesn't show "제출 중...") for the whole upload phase.
  const isBusy = isSubmitting || uploadMutation.isPending;

  const handleSubmit = async () => {
    if (!selectedPhoto) {
      return;
    }

    // null 검사 후 File 타입으로 확정
    const photo = selectedPhoto;

    try {
      const { objectKey } = await uploadMutation.mutateAsync({
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
        {playerLeftNotice && (
          <FeatureNotice title={`${playerLeftNotice.nickname}님이 게임을 나갔어요`}>
            게임은 계속 진행됩니다. (남은 인원 {playerLeftNotice.remainingParticipants}
            명)
          </FeatureNotice>
        )}
        {isMyTurn && currentTurn?.topic && (
          <GameTopicSection title="나의 미션" topic={currentTurn.topic} />
        )}
        {isMyTurn && currentTurn && !currentTurn.topic && (
          <FeatureNotice title="미션을 준비하고 있어요">
            잠시 후 나만의 미션이 표시됩니다.
          </FeatureNotice>
        )}
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
                <CameraPreview
                  imageUrl={previewUrl}
                  isDisabled={isBusy}
                  onPhotoSelect={selectPhoto}
                />
                {uploadMutation.isError && (
                  <p role="alert" className="text-sm text-[#d93f75]">
                    {getApiErrorMessage(
                      uploadMutation.error,
                      "사진을 업로드하지 못했습니다.",
                    )}
                  </p>
                )}
                {submitError ? (
                  <p role="alert" className="text-sm text-[#d93f75]">
                    {getApiErrorMessage(submitError, "사진을 제출하지 못했습니다.")}
                  </p>
                ) : null}
                <Button
                  disabled={!selectedPhoto || isBusy || socketStatus !== "open"}
                  fullWidth
                  onClick={() => void handleSubmit()}
                  className="min-h-14"
                >
                  {isBusy ? "제출 중..." : "사진 제출하기"}
                </Button>
              </>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] bg-[#21173b] text-white/70">
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
        {/* 게임 진행을 방해하지 않도록 로그 영역이 작은 미니 채팅으로 표시한다. */}
        <ChatPanel title="방 채팅" compact {...chat} />
        <RoomSettings room={room} />
        {/* Room은 재게임 정책상 게임이 끝나도 FINISHED에 머물지 않고 WAITING으로
            돌아가므로(방 자체는 계속 살아있음), 결과 화면 진입 여부는 이 게임 세션
            자체의 종료 상태로 판단해야 한다. */}
        {game.status === "finished" && (
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
