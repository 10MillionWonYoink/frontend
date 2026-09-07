import type { GameState, SubmitPhotoResponse } from "../types/game";
import { api } from "./client";
import { endpoints } from "./endpoints";

export async function getGameState(roomId: string): Promise<GameState> {
  const { data } = await api.get<GameState>(endpoints.game.state(roomId));
  return data;
}

export async function submitGamePhoto(
  roomId: string,
  image: File,
): Promise<SubmitPhotoResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await api.post<SubmitPhotoResponse>(
    endpoints.game.photo(roomId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data;
}
