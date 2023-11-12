import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ErrorHandler from "./utils/ErrorHendler";
import { ErrorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user.route";
dotenv.config();
const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

//routes
app.use("/api/v1", userRouter);

// use middlewares
app.use(ErrorMiddleware);

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 400);
  next(err);
});

export default app;
