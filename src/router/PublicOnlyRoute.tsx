import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "../hooks/use-me";
import { LoadingState } from "../components/common/AsyncState";

export default function PublicOnlyRoute() {
  const { data, isPending } = useMe();
  const location = useLocation();
  if (isPending) return <LoadingState message="로그인 정보를 확인하고 있어요." />;
  if (data?.authenticated && data.registrationCompleted)
    return <Navigate to="/" replace />;
  if (data?.authenticated && location.pathname !== "/signup")
    return <Navigate to="/signup" replace />;
  return <Outlet />;
}
