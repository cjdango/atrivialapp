import express from "express";
import { z } from "zod";

export async function createServer() {
  const server = express();
  server.use(express.json());

  const routes: [[string, Promise<any>]] = [
    ["/images", import("./modules/image/image.route")],
  ];

   /**
   * Register module routes
   */
  for (const [path, route] of routes) {
    const router = express.Router();
    (await route).registerHandlers(path, router);
    server.use(router);
  }

  /**
   * Handle known Errors
   */
  server.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid request",
          errors: err.errors,
        });
      }

      next(err);
    }
  );

  return server;
}
