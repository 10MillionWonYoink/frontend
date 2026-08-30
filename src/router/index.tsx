import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import RelayPage from "../pages/Relay/RelayPage";
import ResultPage from "../pages/Result/ResultPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/relay", element: <RelayPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
