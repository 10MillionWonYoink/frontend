import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAxiosError } from "axios";
import { useMe } from "../hooks/use-me";
import { ErrorState, LoadingState } from "../components/common/AsyncState";

export function ProtectedRoute() {
  const { data, error, isPending, refetch } = useMe();
  const location = useLocation();
  if (isPending) return <LoadingState message="로그인 정보를 확인하고 있어요." />;
  if (error && (!isAxiosError(error) || error.response?.status !== 401))
    return (
      <ErrorState
        message="로그인 상태를 확인하지 못했습니다."
        onRetry={() => void refetch()}
      />
    );
  if (!data?.authenticated)
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (!data.registrationCompleted) return <Navigate to="/signup" replace />;
  return <Outlet />;
}
