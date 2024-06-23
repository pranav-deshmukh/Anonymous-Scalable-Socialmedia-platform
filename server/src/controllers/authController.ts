import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import { encrypt } from "../utils/encrypt";

interface ErrorResponse{
    code:number,
    errmsg:string,
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
      userId:uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: 200,
      data: {
        newUser,
      },
    });
  } catch (err:ErrorResponse | any) {
    if (err.code===11000) {
        return res.status(400).json({
            status:'fail',
            message:"Username already exists"
        })
    }
    return next(
      res.status(500).json({
        status: "fail",
        message: (err).message,
      })
    );
  }
};
