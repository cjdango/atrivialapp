import express from "express";
import * as imageController from "./image.controller";

export async function registerHandlers(path: string, router: express.Router) {
  router
    .route(path)
    .get(imageController.getImages)
    .post(imageController.postImage);

  router
    .route(`${path}/:id`)
    .get(imageController.getImage)
    .patch(imageController.patchImage)
    .delete(imageController.deleteImage);
}
