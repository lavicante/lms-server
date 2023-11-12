import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHendler";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
dotenv.config();

//register user
interface IRegistrationBody {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

interface CustomReques extends Request {
  body: IRegistrationBody;
}

export const registrationUser = catchAsyncErrors(
  async (req: CustomReques, res: Response, next: NextFunction) => {
    console.log("registrationUser");
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        email,
        name,
        password,
      };

      const { activationCode, token } = createTokent(user);

      const data = {
        user: {
          name: user.name,
        },
        activationCode,
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: "Please check your email to activate your account",
          activationToken: token,
        });
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const createTokent = (user: IRegistrationBody): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.SECRET_KEY as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};
