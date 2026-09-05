import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { queryClient } from "./api/query-client.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools
        initialIsOpen={false}
      />
    </QueryClientProvider>
  </StrictMode>,
);
