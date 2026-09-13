import type { GameSessionState, LatestGame } from "../types/game";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getLatestGameByRoom(roomId: number): Promise<LatestGame> {
  const { data } = await api.get<LatestGame>(endpoints.game.latestByRoom(roomId));
  return data;
}

export async function getGameSession(gameId: number): Promise<GameSessionState> {
  const { data } = await api.get<GameSessionState>(endpoints.game.detail(gameId));
  return data;
}
