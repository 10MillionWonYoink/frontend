import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGlobalChatHistory, getRoomChatHistory } from "../../api/chat";
import type { ChatMessage } from "../../types/chat";

export const chatQueryKeys = {
  global: ["chat", "global"] as const,
  room: (roomId: number) => ["chat", "room", roomId] as const,
};

export function useGlobalChatHistory(enabled: boolean) {
  return useQuery({
    queryKey: chatQueryKeys.global,
    queryFn: () => getGlobalChatHistory(),
    enabled,
  });
}

export function useRoomChatHistory(roomId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: chatQueryKeys.room(roomId ?? 0),
    queryFn: () => getRoomChatHistory(roomId as number),
    enabled: enabled && Boolean(roomId),
  });
}

// 소켓으로 들어온 실시간 메시지를 같은 채널의 REST 조회 캐시 뒤에 이어붙인다.
// useLobbySocket/useGameSocket 양쪽에서 동일한 방 채팅 채널 캐시를 공유해서 쓴다.
export function appendChatMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly (string | number)[],
  message: ChatMessage,
): void {
  queryClient.setQueryData<ChatMessage[]>(queryKey, (previous) =>
    previous ? [...previous, message] : [message],
  );
}

export function useLoadOlderGlobalMessages() {
  const queryClient = useQueryClient();
  return useCallback(async (): Promise<number> => {
    const current = queryClient.getQueryData<ChatMessage[]>(chatQueryKeys.global);
    const oldest = current?.[0];
    if (!oldest) return 0;
    const older = await getGlobalChatHistory({ beforeId: oldest.id });
    if (older.length === 0) return 0;
    queryClient.setQueryData<ChatMessage[]>(chatQueryKeys.global, (previous) => [
      ...older,
      ...(previous ?? []),
    ]);
    return older.length;
  }, [queryClient]);
}

export function useLoadOlderRoomMessages(roomId: number | undefined) {
  const queryClient = useQueryClient();
  return useCallback(async (): Promise<number> => {
    if (!roomId) return 0;
    const key = chatQueryKeys.room(roomId);
    const current = queryClient.getQueryData<ChatMessage[]>(key);
    const oldest = current?.[0];
    if (!oldest) return 0;
    const older = await getRoomChatHistory(roomId, { beforeId: oldest.id });
    if (older.length === 0) return 0;
    queryClient.setQueryData<ChatMessage[]>(key, (previous) => [
      ...older,
      ...(previous ?? []),
    ]);
    return older.length;
  }, [queryClient, roomId]);
}
