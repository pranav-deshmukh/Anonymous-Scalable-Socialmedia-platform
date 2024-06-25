import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel";
import UserIdModel from "../models/userModelById";
import verificationToken from "../models/tokenModel";
import { Request, Response, NextFunction } from "express";
import { encrypt } from "../utils/encrypt";
import { createSendToken } from "../utils/signToken";
import { sendMail } from "../utils/email";
import {emailQueue} from "../../../Queues/SignupEmailQ/setup"

interface ErrorResponse {
  code: number;
  errmsg: string;
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enctyptedEmail = encrypt(req.body.email);
    const existingUser = await User.findOne({ email: enctyptedEmail });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists",
      });
    }
    const newUser = await User.create({
      userId: uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      isVerified: false,
    });

    const userById = UserIdModel.create({
      userId: newUser.userId,
    });

    const verificationotp = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify-email/${verificationotp}`;
    const message = `Please verify your email by clicking on the following link: ${verificationUrl}`;

    await emailQueue.add(newUser.userId, {
      email: req.body.email,
      subject: "Email Verification",
      message,
    })
    // await sendMail({
    //   email:req.body.email,
    //   message,
    //   subject:"hello",
    // })
    const token = createSendToken(newUser._id, 201, res);
    return res.status(201).json({
      status: "success",
      token: token,
      message:
        "Signup successful! Please verify your email to activate your account.",
    });

    
  } catch (err: ErrorResponse | any) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Username already exists",
      });
    }
    return next(
      res.status(500).json({
        status: "fail",
        message: err.message,
      })
    );
  }
};
