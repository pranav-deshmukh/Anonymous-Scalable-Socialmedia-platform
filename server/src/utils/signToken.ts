import jwt  from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";


const signToken = (id:string)=>{
    return jwt.sign({id:id}, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export const createSendToken = (_Id:Types.ObjectId, statusCode:number, res:Response)=>{
    const token = signToken(_Id.toString());

    return token;
}