import cloudinary from "cloudinary";
import fetch from "node-fetch";
import { loadEnv } from "../../utils/env";
import { prismaClient } from "../../utils/prisma";

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

  let result = [];

  for (const photo of pexelsData.photos) {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      photo.src.original,
      {
        public_id: photo.id.toString(),
        folder: "pexels",
      }
    );

    const image = await prismaClient.image.upsert({
      where: { public_id },
      create: { public_id, uri: secure_url, owner: { connect: { id: 1 } } },
      update: {},
    });

    result.push({
      id: image.id,
      uri: image.uri,
      hits: image.hits,
    });
  }

  return result;
}

export async function createImage(uri: string) {
  const image = await prismaClient.image.create({
    data: {
      uri,
      owner: { connect: { id: 1 } },
    },
  });

  return {
    id: image.id,
    uri: image.uri,
    hits: image.hits,
  };
}

export async function getImage(id: number) {
  await prismaClient.image.findUniqueOrThrow({
    where: { id },
  });

  const image = await prismaClient.image.update({
    where: { id },
    data: { hits: { increment: 1 } },
  });

  return {
    id: image.id,
    uri: image.uri,
    hits: image.hits,
  };
}

export async function updateImage(
  id: number,
  data: { uri?: string; hits?: number }
) {
  await prismaClient.image.findUniqueOrThrow({
    where: { id },
  });

  const image = await prismaClient.image.update({ where: { id }, data });

  return {
    id: image.id,
    uri: image.uri,
    hits: image.hits,
  };
}

export async function deleteImage(id: number) {
  await prismaClient.image.findUniqueOrThrow({
    where: { id },
  });

  const image = await prismaClient.image.delete({ where: { id } });

  return {
    id: image.id,
    uri: image.uri,
    hits: image.hits,
  };
}
