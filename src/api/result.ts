import type { GameResult } from "../types/result";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getGameResult(gameId: number): Promise<GameResult> {
  const { data } = await api.get<GameResult>(endpoints.game.result(gameId));
  return data;
}
