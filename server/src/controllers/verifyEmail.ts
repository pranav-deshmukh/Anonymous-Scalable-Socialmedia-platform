import User from "../models/userModel";
import Token from "../models/tokenModel";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { createSendToken } from "../utils/signToken";
import UserIdModel from "../models/userModelById";

interface ErrorResponse {
    code: number,
    errmsg: string,
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid token or user does not exist',
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                status: 'fail',
                message: 'User is already verified',
            });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Email successfully verified!',
        });
    } catch (error: ErrorResponse | any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Token has expired',
            });
        }
        return res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};
