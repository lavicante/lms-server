import express from "express";
import {
  activateUser,
  loginUser,
  logout,
  registrationUser,
} from "../controllers/user.controller";
import isAuthenticatedMiddleware from "../middlewares/isAuthenticated";
const userRouter = express.Router();

userRouter.post("/register", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticatedMiddleware, logout);

export default userRouter;
