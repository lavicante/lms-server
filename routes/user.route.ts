import express from "express";
import {
  activateUser,
  loginUser,
  logout,
  registrationUser,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/register", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logout);

export default userRouter;
