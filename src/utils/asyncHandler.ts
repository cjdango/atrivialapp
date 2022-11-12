import express from "express";

const asyncHandler =
  (
    fn: (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<any>
  ) =>
  (...args: Parameters<typeof fn>) => {
    return Promise.resolve(fn(args[0], args[1], args[2])).catch(args[2]);
  };

export default asyncHandler;
