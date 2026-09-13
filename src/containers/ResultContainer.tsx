import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { ResultView } from "../components/result/ResultView";
import { useResultRoom } from "../hooks/use-game-result";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function ResultContainer() {
  const { roomId = "" } = useParams();
  const roomQuery = useResultRoom(roomId);
  if (!/^\d+$/.test(roomId) || Number(roomId) <= 0)
    return <ErrorState message="게임 결과 주소가 올바르지 않습니다." />;
  if (roomQuery.isPending) return <LoadingState message="방 정보를 확인하고 있어요." />;
  if (roomQuery.isError || !roomQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(roomQuery.error, "방 정보를 불러오지 못했습니다.")}
        onRetry={() => void roomQuery.refetch()}
      />
    );
  return <ResultView room={roomQuery.data} />;
}
