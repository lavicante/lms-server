import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHendler";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
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

interface CustomReques<T> extends Request {
  body: T;
}

export const registrationUser = catchAsyncErrors(
  async (
    req: CustomReques<IRegistrationBody>,
    res: Response,
    next: NextFunction
  ) => {
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

// activate user

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

interface newUser {
  user: IUser;
  activationCode: string;
}

export const activateUser = catchAsyncErrors(
  async (
    req: CustomReques<IActivationRequest>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { activation_code, activation_token } = req.body;

      const newUser: newUser = jwt.verify(
        activation_token,
        process.env.SECRET_KEY as string
      ) as newUser;

      console.log(newUser, "NEW USER");

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);
