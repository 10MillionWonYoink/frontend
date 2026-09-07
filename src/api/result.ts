import type { GameResult } from "../types/result";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getGameResult(roomId: string): Promise<GameResult> {
  const { data } = await api.get<GameResult>(endpoints.result.detail(roomId));
  return data;
}
