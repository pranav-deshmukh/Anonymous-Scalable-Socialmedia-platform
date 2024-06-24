import express from 'express'
import {signup} from '../controllers/authController'
import { verifyEmail } from '../controllers/verifyEmail';

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.get('/verify-email/:token', verifyEmail);

export default userRouter;