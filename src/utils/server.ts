import Hapi from "@hapi/hapi";
import fetch from "node-fetch";
import { z } from "zod";
import { ServerENVSchema } from "./env";

export const initServer = async (envConfig: z.output<typeof ServerENVSchema>) => {
  const server = Hapi.server({
    port: envConfig.SERVER_PORT,
    host: envConfig.SERVER_HOST,
  });

  const routes: Hapi.ServerRoute[] = [
    {
      method: "GET",
      path: "/images",
      handler: async (request, h) => {
        const res = await fetch(
          "https://api.pexels.com/v1/curated?per_page=1",
          {
            headers: {
              Authorization: envConfig.PEXELS_API_KEY,
            },
          }
        );
        const data = (await res.json()) as {
          photos: { id: number; url: string }[];
        };

        const photos = data.photos.map((photo) => ({
          id: photo.id,
          hits: 1,
          uri: photo.url,
        }));

        return {
          limit: 1,
          data: photos,
        };
      },
    },
    {
      method: "POST",
      path: "/images",
      handler: (request, h) => {
        return "POST, Hello World!";
      },
    },
    {
      method: "GET",
      path: "/images/{id}",
      handler: (request, h) => {
        return "GET id, Hello World!";
      },
    },

    {
      method: "PATCH",
      path: "/images/{id}",
      handler: (request, h) => {
        return "PATCH, Hello World!";
      },
    },
    {
      method: "DELETE",
      path: "/images/{id}",
      handler: (request, h) => {
        return "DELETE, Hello World!";
      },
    },
  ];

  for (const route of routes) {
    server.route(route);
  }

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
