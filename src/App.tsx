import { Outlet } from "react-router-dom";
import { MobileShell } from "./components/layout/MobileShell.tsx";

export default function App() {
  return (
    <MobileShell>
      <Outlet />
    </MobileShell>
  );
}
