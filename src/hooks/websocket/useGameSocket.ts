import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  acknowledge,
  createRealtimeSocket,
  socketErrorMessage,
  type RealtimeSocket,
} from "../../api/realtime";
import { refreshSession } from "../../api/client";
import type { Acknowledgement, SubmitTurnResult } from "../../types/realtime";
import type { GameSessionState } from "../../types/game";
import { gameQueryKeys } from "../game/use-games";
import { roomQueryKeys } from "../room/use-rooms";
import { appendChatMessage, chatQueryKeys } from "../chat/use-chat-history";
import type { RealtimeStatus } from "./useLobbySocket";

export function useGameSocket(
  gameId: number | undefined,
  roomId: number | undefined,
  enabled: boolean,
) {
  const queryClient = useQueryClient();
  const socketRef = useRef<RealtimeSocket | null>(null);
  const subscribedRef = useRef(false);
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [playerLeftNotice, setPlayerLeftNotice] = useState<{
    nickname: string;
    remainingParticipants: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled || !gameId || !Number.isSafeInteger(gameId) || gameId <= 0) return;
    let active = true;
    let refreshed = false;
    const socket = createRealtimeSocket();
    socketRef.current = socket;
    subscribedRef.current = false;
    setStatus("connecting");
    setError(null);
    setPlayerLeftNotice(null);

    const patchGame = (updater: (previous: GameSessionState) => GameSessionState) => {
      queryClient.setQueryData<GameSessionState>(
        gameQueryKeys.detail(gameId),
        (previous) => (previous ? updater(previous) : previous),
      );
    };

    socket.on("connect", () => {
      subscribedRef.current = false;
      setStatus("connecting");
      void acknowledge(
        socket,
        (done: (result: Acknowledgement & { gameId: number }) => void) => {
          socket.emit("game:subscribe", { gameId }, done);
        },
      )
        .then(() => {
          if (!active) return;
          subscribedRef.current = true;
          setStatus("open");
          setError(null);
        })
        .catch((cause: unknown) => {
          if (!active) return;
          setStatus("error");
          setError(
            cause instanceof Error ? cause.message : "게임에 연결하지 못했습니다.",
          );
        });
    });
    socket.on("connect_error", (cause) => {
      subscribedRef.current = false;
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
      subscribedRef.current = false;
      if (active) setStatus("closed");
    });
    socket.on("exception", (cause) => {
      setError(socketErrorMessage(cause));
    });
    socket.on("game:state", (state) => {
      if (state.gameId === gameId)
        queryClient.setQueryData(gameQueryKeys.detail(gameId), state);
    });
    socket.on("game:turn-started", (event) => {
      if (event.gameId !== gameId) return;
      patchGame((previous) => ({
        ...previous,
        status: "in_progress",
        currentTurnNumber: event.turnNumber,
        currentTurn: {
          turnNumber: event.turnNumber,
          userId: event.userId,
          nickname:
            previous.turns.find((turn) => turn.turnNumber === event.turnNumber)
              ?.nickname ?? "",
          startedAt: event.startedAt,
          expiresAt: event.expiresAt,
          // Not included in this event; generated in the background and picked up
          // by the game-session poll below once it lands.
          topic: null,
        },
        turns: previous.turns.map((turn) =>
          turn.turnNumber === event.turnNumber
            ? { ...turn, status: "in_progress" }
            : turn,
        ),
      }));
      // A new turn starting means the game has visibly moved past whichever
      // departure (if any) preceded it, including a leave-triggered skip.
      setPlayerLeftNotice(null);
    });
    socket.on("game:turn-submitted", (event) => {
      if (event.gameId !== gameId) return;
      patchGame((previous) => ({
        ...previous,
        turns: previous.turns.map((turn) =>
          turn.turnNumber === event.submittedTurn.turnNumber
            ? {
                ...turn,
                status: "submitted",
                imageKey: event.submittedTurn.imageKey,
                submittedAt: new Date().toISOString(),
              }
            : turn,
        ),
      }));
    });
    socket.on("game:turn-expired", (event) => {
      if (event.gameId !== gameId) return;
      patchGame((previous) => ({
        ...previous,
        turns: previous.turns.map((turn) =>
          turn.turnNumber === event.expiredTurn.turnNumber
            ? { ...turn, status: "expired" }
            : turn,
        ),
      }));
    });
    socket.on("game:finished", (event) => {
      if (event.gameId !== gameId) return;
      patchGame((previous) => ({
        ...previous,
        status: "finished",
        currentTurn: null,
      }));
      setPlayerLeftNotice(null);
      // The room's active-membership status (used by the 1-room-per-user policy on
      // Home) changes to finished here too, not just this room's own detail query.
      void queryClient.invalidateQueries({
        queryKey: roomQueryKeys.all,
      });
    });
    // Fired when a player leaves mid-game but the game continues (2+ players
    // remain) — their unplayed turns are skipped (EXPIRED) server-side via the
    // normal game:turn-started/game:turn-expired events, this is purely
    // informational. If the leave instead drops the room to 1 player, the
    // backend finishes the game directly and this event is not sent.
    socket.on("game:player-left", (event) => {
      if (event.gameId !== gameId) return;
      const current = queryClient.getQueryData<GameSessionState>(
        gameQueryKeys.detail(gameId),
      );
      const nickname =
        current?.turns.find((turn) => turn.userId === event.leftUserId)?.nickname ??
        "상대방";
      setPlayerLeftNotice({
        nickname,
        remainingParticipants: event.remainingParticipants,
      });
    });
    socket.on("chat:room:message", (message) => {
      if (roomId && message.roomId === roomId)
        appendChatMessage(queryClient, chatQueryKeys.room(roomId), message);
    });
    socket.connect();
    return () => {
      active = false;
      subscribedRef.current = false;
      socket.disconnect();
      socket.removeAllListeners();
      socketRef.current = null;
    };
  }, [enabled, gameId, roomId, queryClient]);

  const requireSocket = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !subscribedRef.current)
      throw new Error("게임 실시간 연결 후 다시 시도해주세요.");
    setError(null);
    return socket;
  }, []);

  const submitTurn = useCallback(
    async (imageKey: string) => {
      const socket = requireSocket();
      if (!gameId) throw new Error("게임 정보를 확인할 수 없습니다.");
      return acknowledge(
        socket,
        (done: (result: Acknowledgement & SubmitTurnResult) => void) =>
          socket.emit("game:turn:submit", { gameId, imageKey }, done),
      );
    },
    [requireSocket, gameId],
  );
  const sendRoomChat = useCallback(
    async (content: string) => {
      const socket = requireSocket();
      if (!roomId) throw new Error("방 정보를 확인할 수 없습니다.");
      return acknowledge(
        socket,
        (done: (result: Acknowledgement & { message: unknown }) => void) =>
          socket.emit("chat:room:send", { roomId, content }, done),
        "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    },
    [requireSocket, roomId],
  );

  return {
    status: enabled ? status : "idle",
    error,
    playerLeftNotice,
    submitTurn,
    sendRoomChat,
  };
}
