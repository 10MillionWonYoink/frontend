import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  acknowledge,
  createRealtimeSocket,
  socketErrorMessage,
  type RealtimeSocket,
} from "../../api/realtime";
import { refreshSession } from "../../api/client";
import type {
  Acknowledgement,
  GameStartedBroadcast,
  HostChangeResult,
  LeaveResult,
  RoomUpdate,
  RoomUpdated,
} from "../../types/realtime";
import type { Room } from "../../types/room";
import { roomQueryKeys } from "../room/use-rooms";
import { appendChatMessage, chatQueryKeys } from "../chat/use-chat-history";

export type RealtimeStatus = "idle" | "connecting" | "open" | "closed" | "error";

export function useLobbySocket(roomId: number, enabled: boolean) {
  const queryClient = useQueryClient();
  const socketRef = useRef<RealtimeSocket | null>(null);
  const subscribedRef = useRef(false);
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [roomClosed, setRoomClosed] = useState(false);

  useEffect(() => {
    if (!enabled || !Number.isSafeInteger(roomId) || roomId <= 0) return;
    let active = true;
    let refreshed = false;
    const socket = createRealtimeSocket();
    socketRef.current = socket;
    subscribedRef.current = false;
    setStatus("connecting");
    setError(null);
    setRoomClosed(false);
    const refreshRoom = () => {
      void queryClient.invalidateQueries({
        queryKey: roomQueryKeys.detail(String(roomId)),
      });
    };
    const refreshLists = () => {
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.list });
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.mine });
    };
    const refreshRoomAndLists = () => {
      refreshRoom();
      refreshLists();
    };
    socket.on("connect", () => {
      subscribedRef.current = false;
      setStatus("connecting");
      void acknowledge(
        socket,
        (done: (result: Acknowledgement & { roomId: number }) => void) => {
          socket.emit("lobby:subscribe", { roomId }, done);
        },
      )
        .then(() => {
          if (!active) return;
          subscribedRef.current = true;
          setStatus("open");
          setError(null);
          // The initial REST fetch (on mount) and this subscribe ack land at
          // slightly different times; any lobby event fired in that gap (e.g.
          // another member's leave/ready-change right as this client entered
          // the room) would otherwise go unseen until the next 5s poll.
          refreshRoom();
        })
        .catch((cause: unknown) => {
          if (!active) return;
          setStatus("error");
          setError(
            cause instanceof Error ? cause.message : "대기실에 연결하지 못했습니다.",
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
      refreshRoom();
    });
    socket.on("lobby:member-joined", () => {
      refreshRoomAndLists();
    });
    socket.on("lobby:ready-changed", (member) => {
      if (member.roomId !== roomId) return;
      queryClient.setQueryData<Room>(
        roomQueryKeys.detail(String(roomId)),
        (previous) =>
          previous
            ? {
                ...previous,
                players: previous.players.map((player) =>
                  player.id === member.userId
                    ? { ...player, isReady: member.isReady }
                    : player,
                ),
              }
            : previous,
      );
      refreshRoom();
    });
    socket.on("lobby:room-updated", (room) => {
      if (room.id === roomId) refreshRoomAndLists();
    });
    socket.on("lobby:host-changed", (result) => {
      if (result.roomId === roomId) refreshRoom();
    });
    socket.on("lobby:member-left", (result) => {
      if (result.roomId === roomId) refreshRoomAndLists();
    });
    socket.on("lobby:room-closed", (result) => {
      if (result.roomId !== roomId) return;
      subscribedRef.current = false;
      setRoomClosed(true);
      refreshLists();
    });
    socket.on("lobby:game-started", (payload) => {
      if (payload.roomId === roomId) refreshRoom();
    });
    socket.on("chat:room:message", (message) => {
      if (message.roomId === roomId)
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
  }, [enabled, queryClient, roomId]);

  const requireSocket = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !subscribedRef.current)
      throw new Error("대기실 실시간 연결 후 다시 시도해주세요.");
    setError(null);
    return socket;
  }, []);
  const setReady = useCallback(
    async (isReady: boolean) => {
      const socket = requireSocket();
      return acknowledge(socket, (done: (result: Acknowledgement) => void) =>
        socket.emit("lobby:ready:set", { roomId, isReady }, done),
      );
    },
    [requireSocket, roomId],
  );
  const leave = useCallback(async () => {
    const socket = requireSocket();
    return acknowledge(
      socket,
      (done: (result: Acknowledgement & LeaveResult) => void) =>
        socket.emit("lobby:leave", { roomId }, done),
    );
  }, [requireSocket, roomId]);
  const updateRoom = useCallback(
    async (changes: Omit<RoomUpdate, "roomId">) => {
      const socket = requireSocket();
      return acknowledge(
        socket,
        (done: (result: Acknowledgement & { room: RoomUpdated }) => void) =>
          socket.emit("lobby:room:update", { ...changes, roomId }, done),
      );
    },
    [requireSocket, roomId],
  );
  const changeHost = useCallback(
    async (newHostUserId: number) => {
      const socket = requireSocket();
      return acknowledge(
        socket,
        (done: (result: Acknowledgement & HostChangeResult) => void) =>
          socket.emit("lobby:host:change", { roomId, newHostUserId }, done),
      );
    },
    [requireSocket, roomId],
  );
  const startGame = useCallback(async () => {
    const socket = requireSocket();
    return acknowledge(
      socket,
      (done: (result: Acknowledgement & GameStartedBroadcast) => void) =>
        socket.emit("game:start", { roomId }, done),
    );
  }, [requireSocket, roomId]);
  const reconnect = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.disconnect();
    setError(null);
    socket.connect();
  }, []);
  const sendRoomChat = useCallback(
    async (content: string) => {
      const socket = requireSocket();
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
    roomClosed,
    setReady,
    sendRoomChat,
    leave,
    updateRoom,
    changeHost,
    startGame,
    reconnect,
  };
}
