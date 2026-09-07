import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { GameView } from "../components/game/GameView";
import { useGameSession } from "../hooks/game/use-game-session";
import { usePhotoSelection } from "../hooks/game/use-photo-selection";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function GameContainer() {
  const navigate = useNavigate();
  const { roomId = "" } = useParams();
  const handleGameFinish = useCallback(
    () => navigate(`/rooms/${roomId}/result`, { replace: true }),
    [navigate, roomId],
  );
  const session = useGameSession(roomId, handleGameFinish);
  const photoSelection = usePhotoSelection();

  if (!roomId) {
    return <ErrorState message="게임 주소가 올바르지 않습니다." />;
  }

  if (session.isGamePending) {
    return <LoadingState message="게임을 준비하고 있어요." />;
  }

  if (session.gameError || !session.game) {
    return (
      <ErrorState
        message={getApiErrorMessage(
          session.gameError,
          "게임 정보를 불러오지 못했습니다.",
        )}
        onRetry={() => void session.refetchGame()}
      />
    );
  }

  const handleSubmit = async () => {
    if (photoSelection.selectedPhoto) {
      try {
        await session.submitPhoto(photoSelection.selectedPhoto);
      } catch {
        // Mutation state is shown below the preview so the user can retry.
      }
    }
  };

  return (
    <GameView
      game={session.game}
      selectedPhoto={photoSelection.selectedPhoto}
      previewUrl={photoSelection.previewUrl}
      remainingSeconds={session.remainingSeconds}
      socketStatus={session.socketStatus}
      isSubmitting={session.isSubmitting}
      submitErrorMessage={
        session.submitError
          ? getApiErrorMessage(session.submitError, "사진 제출에 실패했습니다.")
          : undefined
      }
      onPhotoSelect={photoSelection.selectPhoto}
      onSubmit={() => void handleSubmit()}
    />
  );
}
