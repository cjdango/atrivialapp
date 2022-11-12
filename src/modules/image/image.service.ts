import fetch from "node-fetch";
import { loadEnv } from "../../utils/env";

const envConfig = loadEnv();

export async function getImages(limit: number) {
  const url = new URL("v1/curated", envConfig.PEXELS_API_URL);
  url.searchParams.append("per_page", limit.toString());

  const res = await fetch(url.href, {
    headers: { Authorization: envConfig.PEXELS_API_KEY },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  const data = (await res.json()) as { photos: { id: number; url: string }[] };

  return data.photos.map((photo) => ({
    id: photo.id,
    hits: 1,
    uri: photo.url,
  }));
}
