import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { useMe } from "../hooks/use-me.ts";

export function ProtectedRoute() {
  const {
    data,
    isPending,
    isError,
  } = useMe();

  if (isPending) {
    return (
      <div>
        로그인 정보를 확인하고 있습니다.
      </div>
    );
  }

  if (isError || !data?.authenticated) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  return <Outlet />;
}
