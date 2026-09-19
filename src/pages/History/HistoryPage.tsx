import { AppHeader } from "../../components/layout/AppHeader";
import { HistoryContainer } from "../../containers/HistoryContainer";

export default function HistoryPage() {
  return (
    <>
      <AppHeader backTo={{ to: "/", label: "홈" }} />
      <HistoryContainer />
    </>
  );
}
