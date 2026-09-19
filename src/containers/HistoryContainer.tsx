import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { Button } from "../components/common/Button";
import { GameHistoryList } from "../components/history/GameHistoryList";
import { useMyGameHistory } from "../hooks/game/use-games";
import { getApiErrorMessage } from "../utils/get-api-error-message";

const PAGE_SIZE = 20;

export function HistoryContainer() {
  const historyQuery = useMyGameHistory(PAGE_SIZE);

  if (historyQuery.isPending) return <LoadingState message="게임 기록을 불러오고 있어요." />;

  if (historyQuery.isError || !historyQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(historyQuery.error, "게임 기록을 불러오지 못했습니다.")}
        onRetry={() => void historyQuery.refetch()}
      />
    );

  const games = historyQuery.data.pages.flatMap((page) => page.games);

  return (
    <section className="flex-1 space-y-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
      <div>
        <h1 className="text-lg font-black text-[#342953]">내 게임 기록</h1>
        <p className="mt-1 text-xs text-[#8b85a8]">
          지금까지 참여했던 게임을 다시 확인할 수 있어요.
        </p>
      </div>
      <GameHistoryList games={games} />
      {historyQuery.hasNextPage && (
        <div className="pt-1 text-center">
          <Button
            variant="ghost"
            disabled={historyQuery.isFetchingNextPage}
            onClick={() => void historyQuery.fetchNextPage()}
          >
            {historyQuery.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </Button>
        </div>
      )}
    </section>
  );
}
