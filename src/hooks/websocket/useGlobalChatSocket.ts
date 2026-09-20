import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  acknowledge,
  createRealtimeSocket,
  socketErrorMessage,
  type RealtimeSocket,
} from "../../api/realtime";
import { refreshSession } from "../../api/client";
import type { Acknowledgement } from "../../types/realtime";
import { appendChatMessage, chatQueryKeys } from "../chat/use-chat-history";
import type { RealtimeStatus } from "./useLobbySocket";

// 전체 채팅은 연결되는 즉시(별도 subscribe 없이) 자동 참여되므로, 이 훅은 로비/게임
// 소켓과 별개로 채팅 패널이 열려 있는 동안만 자체 소켓 연결을 하나 더 맺는다.
export function useGlobalChatSocket(enabled: boolean) {
  const queryClient = useQueryClient();
  const socketRef = useRef<RealtimeSocket | null>(null);
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let refreshed = false;
    const socket = createRealtimeSocket();
    socketRef.current = socket;
    setStatus("connecting");
    setError(null);

    socket.on("connect", () => {
      if (!active) return;
      setStatus("open");
      setError(null);
    });
    socket.on("connect_error", (cause) => {
      if (!active) return;
      setStatus("error");
      setError(
        cause.message === "UNAUTHORIZED"
          ? "로그인 연결을 확인하고 있습니다."
          : "실시간 연결에 실패했습니다.",
      );
      if (cause.message === "UNAUTHORIZED" && !refreshed) {
        refreshed = true;
        void refreshSession()
          .then(() => {
            if (active) socket.connect();
          })
          .catch(() => {
            if (active) setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
          });
      }
    });
    socket.on("disconnect", () => {
      if (active) setStatus("closed");
    });
    socket.on("exception", (cause) => {
      setError(socketErrorMessage(cause));
    });
    socket.on("chat:global:message", (message) => {
      appendChatMessage(queryClient, chatQueryKeys.global, message);
    });
    socket.connect();
    return () => {
      active = false;
      socket.disconnect();
      socket.removeAllListeners();
      socketRef.current = null;
    };
  }, [enabled, queryClient]);

  const sendMessage = useCallback(async (content: string) => {
    const socket = socketRef.current;
    if (!socket?.connected) throw new Error("채팅 연결 후 다시 시도해주세요.");
    return acknowledge(
      socket,
      (done: (result: Acknowledgement & { message: unknown }) => void) =>
        socket.emit("chat:global:send", { content }, done),
      "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  }, []);

  return {
    status: enabled ? status : "idle",
    error,
    sendMessage,
  };
}
