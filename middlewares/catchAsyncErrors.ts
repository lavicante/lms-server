import { NextFunction, Request, Response } from "express";

export const catchAsyncErrors =
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn).catch(next);
  };