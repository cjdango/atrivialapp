import { z } from "zod";
import asyncHandler from "../../utils/asyncHandler";
import * as imageService from "./image.service";

export const getImages = asyncHandler(async (req, res) => {
  const parseQuery = () =>
    z
      .object({
        limit: z.preprocess(
          (arg: any) => Number(arg || 5),
          z.number().int().min(1).max(10)
        ),
      })
      .parse(req.query);

  const { limit } = parseQuery();

  res.status(200).json({
    limit,
    data: await imageService.getImages(limit),
  });
});

export const postImage = asyncHandler(async (req, res) => {
  const parseBody = () =>
    z
      .object({
        uri: z.string().url(),
      })
      .parse(req.body);

  const { uri } = parseBody();

  res.status(201).json(await imageService.createImage(uri));
});

export const getImage = asyncHandler(async (req, res, next) => {
  const parseParams = () =>
    z
      .object({
        id: z.preprocess((arg: any) => Number(arg), z.number().int()),
      })
      .parse(req.params);

  const { id } = parseParams();

  try {
    res.status(200).json(await imageService.getImage(id));
  } catch (e: any) {
    if (e.name === "NotFoundError") {
      res.status(404).json({ message: "Image not found" });
    }
  }
});

export const patchImage = asyncHandler(async (req, res, next) => {
  const parseParams = () =>
    z
      .object({
        id: z.preprocess((arg: any) => Number(arg), z.number().int()),
      })
      .parse(req.params);

  const parseBody = () =>
    z
      .object({
        uri: z.string().url().optional(),
        hits: z
          .preprocess((arg: any) => Number(arg), z.number().int())
          .optional(),
      })
      .parse(req.body);

  const { id } = parseParams();
  const { uri, hits } = parseBody();

  try {
    res.status(200).json(await imageService.updateImage(id, { uri, hits }));
  } catch (e: any) {
    if (e.name === "NotFoundError") {
      res.status(404).json({ message: "Image not found" });
    }
  }
});

export const deleteImage = asyncHandler(async (req, res, next) => {
  const parseParams = () =>
    z
      .object({
        id: z.preprocess((arg: any) => Number(arg), z.number().int()),
      })
      .parse(req.params);

  const { id } = parseParams();

  try {
    res.status(200).json(await imageService.deleteImage(id));
  } catch (e: any) {
    if (e.name === "NotFoundError") {
      res.status(404).json({ message: "Image not found" });
    }
  }
});
