import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { useMe } from "../hooks/use-me";

export default function PublicOnlyRoute() {
  const {
    data,
    isPending,
  } = useMe();

  if (isPending) {
    return <div>로그인 확인 중...</div>;
  }

  if (data?.authenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}