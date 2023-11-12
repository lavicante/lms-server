import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "./catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import ErrorHandler from "../utils/ErrorHendler";
import { redis } from "../utils/redis";

dotenv.config();
const isAuthenticatedMiddleware = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource.", 401)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET_KEY || ""
    ) as JwtPayload;

    if (!decoded) {
      next(new ErrorHandler("Access token is not valid.", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }

    req.user = JSON.parse(user);

    next();
  }
);

export default isAuthenticatedMiddleware;
