import { AppHeader } from "../../components/layout/AppHeader";
import { MobileShell } from "../../components/layout/MobileShell";
import { HomeContainer } from "../../containers/HomeContainer";

export default function HomePage() {
  return (
    <MobileShell>
      <AppHeader />
      <HomeContainer />
    </MobileShell>
  );
}
