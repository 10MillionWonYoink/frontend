import { AppHeader } from "../../components/layout/AppHeader";
import { GameHistoryDetailContainer } from "../../containers/GameHistoryDetailContainer";

export default function GameHistoryDetailPage() {
  return (
    <>
      <AppHeader backTo={{ to: "/history", label: "게임 기록으로" }} />
      <GameHistoryDetailContainer />
    </>
  );
}
