import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { GameView } from "../components/game/GameView";
import { useRoom } from "../hooks/room/use-rooms";
import { useGameSession } from "../hooks/game/use-game-session";
import { useMe } from "../hooks/use-me";
import { getApiErrorMessage } from "../utils/get-api-error-message";
import { isValidRoomId } from "../utils/is-valid-room-id";

export function GameContainer() {
  const { roomId = "" } = useParams();
  const roomQuery = useRoom(roomId);
  const meQuery = useMe();
  const session = useGameSession(roomId);
  if (!isValidRoomId(roomId))
    return <ErrorState message="게임 주소가 올바르지 않습니다." />;
  if (roomQuery.isPending || session.isPending)
    return <LoadingState message="게임 정보를 확인하고 있어요." />;
  if (roomQuery.isError || !roomQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(roomQuery.error, "방 정보를 불러오지 못했습니다.")}
        onRetry={() => void roomQuery.refetch()}
      />
    );
  if (session.error || !session.game)
    return (
      <ErrorState
        message={getApiErrorMessage(session.error, "게임 정보를 불러오지 못했습니다.")}
        onRetry={() => void session.refetch()}
      />
    );
  return (
    <GameView
      room={roomQuery.data}
      game={session.game}
      meUserId={meQuery.data?.user?.id}
      socketStatus={session.socketStatus}
      onSubmitTurn={session.submitTurn}
      isSubmitting={session.isSubmitting}
      submitError={session.submitError}
    />
  );
}
