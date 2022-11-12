import cloudinary from "cloudinary";
import fetch from "node-fetch";
import { loadEnv } from "../../utils/env";

const envConfig = loadEnv();

cloudinary.v2.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

export async function getImages(limit: number) {
  const url = new URL("v1/curated", envConfig.PEXELS_API_URL);
  url.searchParams.append("per_page", limit.toString());

  const res = await fetch(url.href, {
    headers: { Authorization: envConfig.PEXELS_API_KEY },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  const pexelsData = (await res.json()) as {
    photos: { id: number; src: { original: string } }[];
  };

  let db: any[] = [];

  await Promise.allSettled(
    pexelsData.photos.map(async (photo) => {
      const data = await cloudinary.v2.uploader.upload(photo.src.original, {
        folder: "pexels",
        public_id: photo.id.toString(),
      });
      console.log('data', data.public_id);
      db.push(data);
    })
  );

  return db.map((photo) => ({
    id: photo.public_id,
    hits: 1,
    uri: photo.secure_url,
  }));
}
