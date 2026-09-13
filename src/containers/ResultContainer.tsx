import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { ResultView } from "../components/result/ResultView";
import { useRoom } from "../hooks/room/use-rooms";
import { useGameResult } from "../hooks/use-game-result";
import { getApiErrorMessage } from "../utils/get-api-error-message";
import { isValidRoomId } from "../utils/is-valid-room-id";

export function ResultContainer() {
  const { roomId = "" } = useParams();
  const roomQuery = useRoom(roomId);
  const resultQuery = useGameResult(roomId);
  if (!isValidRoomId(roomId))
    return <ErrorState message="게임 결과 주소가 올바르지 않습니다." />;
  if (roomQuery.isPending || resultQuery.isPending)
    return <LoadingState message="게임 결과를 확인하고 있어요." />;
  if (roomQuery.isError || !roomQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(roomQuery.error, "방 정보를 불러오지 못했습니다.")}
        onRetry={() => void roomQuery.refetch()}
      />
    );
  if (resultQuery.error || !resultQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(
          resultQuery.error,
          "아직 게임 결과를 볼 수 없습니다.",
        )}
        onRetry={() => void resultQuery.refetch()}
      />
    );
  return <ResultView room={roomQuery.data} result={resultQuery.data} />;
}
