import { InviteJoinContainer } from "../containers/InviteJoinContainer";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import GamePage from "../pages/Relay/GamePage";
import RoomPage from "../pages/Relay/RoomPage";
import ResultPage from "../pages/Result/ResultPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import App from "../App.tsx";
import ErrorPage from "../pages/Error/ErrorPage.tsx";
import SignInPage from "../pages/Auth/SignInPage.tsx";
import SignUpPage from "../pages/Auth/SignUpPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import PublicOnlyRoute from "./PublicOnlyRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "relay", element: <Navigate to="/" replace /> },
          { path: "result", element: <Navigate to="/" replace /> },
          { path: "rooms/join/:inviteCode", element: <InviteJoinContainer /> },
          { path: "rooms/:roomId", element: <RoomPage /> },
          { path: "rooms/:roomId/game", element: <GamePage /> },
          { path: "rooms/:roomId/result", element: <ResultPage /> },
        ],
      },

      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "signin", element: <SignInPage /> },
          { path: "signup", element: <SignUpPage /> },
        ],
      },
      { path: "error", element: <ErrorPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
