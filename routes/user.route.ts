import express from "express";
import { registrationUser } from "../controlls/user.controll";
const userRouter = express.Router();

userRouter.post("/register", registrationUser);

export default userRouter;
