import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { GameView } from "../components/game/GameView";
import { useGameSession } from "../hooks/game/use-game-session";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function GameContainer() {
  const { roomId = "" } = useParams();
  const session = useGameSession(roomId);
  if (!/^\d+$/.test(roomId) || Number(roomId) <= 0)
    return <ErrorState message="게임 주소가 올바르지 않습니다." />;
  if (session.isPending) return <LoadingState message="방 정보를 확인하고 있어요." />;
  if (session.error || !session.room)
    return (
      <ErrorState
        message={getApiErrorMessage(session.error, "방 정보를 불러오지 못했습니다.")}
        onRetry={() => void session.refetch()}
      />
    );
  return <GameView room={session.room} />;
}
