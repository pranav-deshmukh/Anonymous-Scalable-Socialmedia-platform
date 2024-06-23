import mongoose from "mongoose";
// import bcrypt from 'bcrypt'
// import validator from "validator";
// import {encrypt} from '../utils/encrypt'

const userFinalModel = new mongoose.Schema({
    userId:{
        type:String,
        unique:true,
    }
})

const UserId = mongoose.model("UserId", userFinalModel);
export default UserId;