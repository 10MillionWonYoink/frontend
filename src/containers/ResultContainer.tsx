import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { ResultView } from "../components/result/ResultView";
import { useGameResult } from "../hooks/use-game-result";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function ResultContainer() {
  const { roomId } = useParams();
  const resultQuery = useGameResult(roomId);

  if (!roomId) {
    return <ErrorState message="게임 결과 주소가 올바르지 않습니다." />;
  }

  if (resultQuery.isPending) {
    return <LoadingState message="AI가 최종 결과를 정리하고 있어요." />;
  }

  if (resultQuery.isError || !resultQuery.data) {
    return (
      <ErrorState
        message={getApiErrorMessage(
          resultQuery.error,
          "게임 결과를 불러오지 못했습니다.",
        )}
        onRetry={() => void resultQuery.refetch()}
      />
    );
  }

  return <ResultView result={resultQuery.data} />;
}
