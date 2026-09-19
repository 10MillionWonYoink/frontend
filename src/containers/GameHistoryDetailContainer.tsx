import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { GameHistoryDetailView } from "../components/history/GameHistoryDetailView";
import { useGameResultQuery } from "../hooks/game/use-games";
import { getApiErrorMessage } from "../utils/get-api-error-message";

function isValidGameId(gameId: string | undefined): boolean {
  if (!gameId) return false;
  return /^\d+$/.test(gameId) && Number(gameId) > 0;
}

export function GameHistoryDetailContainer() {
  const { gameId = "" } = useParams();
  const valid = isValidGameId(gameId);
  const resultQuery = useGameResultQuery(valid ? Number(gameId) : undefined);

  if (!valid) return <ErrorState message="게임 기록 주소가 올바르지 않습니다." />;
  if (resultQuery.isPending) return <LoadingState message="게임 기록을 불러오고 있어요." />;

  if (resultQuery.isError || !resultQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(resultQuery.error, "게임 기록을 불러오지 못했습니다.")}
        onRetry={() => void resultQuery.refetch()}
      />
    );

  return <GameHistoryDetailView result={resultQuery.data} />;
}
