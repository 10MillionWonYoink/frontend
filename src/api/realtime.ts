import { io, type Socket } from "socket.io-client";
import { API_BASE_URL, WS_BASE_URL } from "../config/env";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketFailure,
} from "../types/realtime";

export type RealtimeSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createRealtimeSocket(): RealtimeSocket {
  const url = new URL(WS_BASE_URL ?? API_BASE_URL, window.location.origin);
  url.protocol =
    url.protocol === "wss:" || url.protocol === "https:" ? "https:" : "http:";
  return io(url.origin + "/realtime", {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
    reconnectionAttempts: 5,
  });
}

export function socketErrorMessage(error: SocketFailure): string {
  return Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? "요청을 처리하지 못했습니다.");
}

// Nest emits exceptions separately from acknowledgements. Never leave a mutation pending.
// Commands are not automatically retried: a lost acknowledgement may follow a successful write.
export function acknowledge<T>(
  socket: RealtimeSocket,
  send: (done: (result: T) => void) => void,
  timeoutMessage = "응답이 지연되고 있습니다. 현재 방 상태를 확인한 뒤 다시 시도해주세요.",
): Promise<T> {
  if (!socket.connected)
    return Promise.reject(new Error("실시간 연결을 확인해주세요."));
  return new Promise<T>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timer);
      socket.off("exception", onException);
      socket.off("disconnect", onDisconnect);
    };
    const onException = (error: SocketFailure) => {
      cleanup();
      reject(new Error(socketErrorMessage(error)));
    };
    const onDisconnect = () => {
      cleanup();
      reject(new Error("연결이 끊겼습니다. 현재 방 상태를 확인해주세요."));
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error(timeoutMessage));
    }, 8_000);
    socket.once("exception", onException);
    socket.once("disconnect", onDisconnect);
    send((result) => {
      cleanup();
      resolve(result);
    });
  });
}
