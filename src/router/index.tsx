import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import RelayPage from "../pages/Relay/RelayPage";
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
      // 로그인 사용자만 접근
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "relay", element: <RelayPage /> },
          { path: "result", element: <ResultPage /> },
        ],
      },

      // 비로그인 사용자만 접근
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
