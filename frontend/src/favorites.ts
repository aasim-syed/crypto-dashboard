import { API } from "./api";

export type FavoriteRow = { id: number; user_id: number; coin_id: string };

export async function fetchFavorites(): Promise<string[]> {
  const { data } = await API.get<FavoriteRow[]>("/favorites");
  return data.map((f) => f.coin_id);
}

export async function addFavorite(coinId: string) {
  await API.post(`/favorites/${coinId}`);
}

export async function removeFavorite(coinId: string) {
  await API.delete(`/favorites/${coinId}`);
}
