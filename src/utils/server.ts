import Hapi from "@hapi/hapi";

export const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  const routes = [
    {
      method: "GET",
      path: "/images",
      handler: (request, h) => {
        return {
          limit: 5,
          data: [
            {
              id: 1,
              hits: 1,
              uri: "cloudinary.com/",
            },
            {
              id: 2,
              hits: 1,
              uri: "cloudinary.com/",
            },
          ],
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
