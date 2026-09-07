import { useCallback, useEffect, useRef, useState } from "react";
import { endpoints } from "../../api/endpoints";
import { API_BASE_URL, WS_BASE_URL } from "../../config/env";
import type { GameEventType, GameSocketEvent } from "../../types/game";

export type GameSocketStatus = "idle" | "connecting" | "open" | "closed" | "error";

const RECONNECT_DELAY_MS = 2_000;
const gameEventTypes = new Set<GameEventType>([
  "GAME_START",
  "TURN_START",
  "PHOTO_SUBMIT",
  "TURN_END",
  "GAME_FINISH",
]);

function getWebSocketBaseUrl(): string {
  if (WS_BASE_URL) {
    return WS_BASE_URL;
  }

  const apiBaseUrl = new URL(API_BASE_URL, window.location.origin);
  apiBaseUrl.protocol = apiBaseUrl.protocol === "https:" ? "wss:" : "ws:";
  apiBaseUrl.pathname = "";
  apiBaseUrl.search = "";
  apiBaseUrl.hash = "";
  return apiBaseUrl.toString().replace(/\/$/, "");
}

function parseGameSocketEvent(message: string): GameSocketEvent | null {
  try {
    const event: unknown = JSON.parse(message);

    if (
      typeof event !== "object" ||
      event === null ||
      !("type" in event) ||
      typeof event.type !== "string" ||
      !gameEventTypes.has(event.type as GameEventType) ||
      !("payload" in event) ||
      typeof event.payload !== "object" ||
      event.payload === null
    ) {
      return null;
    }

    return event as GameSocketEvent;
  } catch {
    return null;
  }
}

export function useGameSocket(
  roomId: string | undefined,
  onEvent: (event: GameSocketEvent) => void,
) {
  const [status, setStatus] = useState<GameSocketStatus>("idle");
  const eventHandlerRef = useRef(onEvent);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    eventHandlerRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(() => {
    if (!roomId) {
      setStatus("idle");
      return () => undefined;
    }

    let shouldReconnect = true;
    setStatus("connecting");
    const socket = new WebSocket(
      `${getWebSocketBaseUrl()}${endpoints.websocket.game(roomId)}`,
    );

    socket.onopen = () => setStatus("open");
    socket.onerror = () => setStatus("error");
    socket.onmessage = ({ data }) => {
      if (typeof data !== "string") {
        return;
      }

      const event = parseGameSocketEvent(data);
      if (event) {
        eventHandlerRef.current(event);
      }
    };
    socket.onclose = () => {
      setStatus("closed");
      if (shouldReconnect) {
        reconnectTimerRef.current = window.setTimeout(
          () => reconnectRef.current(),
          RECONNECT_DELAY_MS,
        );
      }
    };

    return () => {
      shouldReconnect = false;
      socket.close();
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [roomId]);

  useEffect(() => {
    let disconnect: () => void = () => undefined;
    reconnectRef.current = () => {
      disconnect();
      disconnect = connect();
    };
    disconnect = connect();

    return () => disconnect();
  }, [connect]);

  return { status };
}
