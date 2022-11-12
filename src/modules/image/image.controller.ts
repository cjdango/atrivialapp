import express from "express";
import { z } from "zod";
import asyncHandler from "../../utils/asyncHandler";
import * as imageService from "./image.service";

export const getImages = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
  }
);

export const postImage = asyncHandler(async (req, res, next) => {
  res.status(400).json({ message: "Not implemented!" });
});