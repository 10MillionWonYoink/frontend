import type { ChatMessage } from "../types/chat";
import { api } from "./client";
import { endpoints } from "./endpoints";

export interface ChatHistoryParams {
  limit?: number;
  beforeId?: number;
}

export async function getGlobalChatHistory(
  params: ChatHistoryParams = {},
): Promise<ChatMessage[]> {
  const { data } = await api.get<ChatMessage[]>(endpoints.chat.global, { params });
  return data;
}

export async function getRoomChatHistory(
  roomId: number,
  params: ChatHistoryParams = {},
): Promise<ChatMessage[]> {
  const { data } = await api.get<ChatMessage[]>(endpoints.chat.room(roomId), {
    params,
  });
  return data;
}
