import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";
import {encrypt} from '../utils/encrypt'

interface IUserSchema{
  userId:string,
  username:string,
  email:string,
  password:string,
  passwordConfirm:string,
  isVerified:boolean,
}


const userSchema = new mongoose.Schema<IUserSchema>({
  userId:{
    type:String,
    required:true,
    unique:true,
  },
    username:{
        type:String,
        required: [true, "Please tell your name"],
        unique:true,
    },
    email:{
        type:String,
        required:[true, "Please tell your email"],
        unique:true,
        lowercase: true,
        // validate: [validator.isEmail, "Please provide a valid email"],
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minlength:8,
        select: false
    },
    passwordConfirm: {
    type: String,
    // required: [true, "Please confirm your password"],
    // validate: {
    //   validator: function (this:IUserSchema,el:string):boolean {
    //     return el === this.password;
    //   },
    //   message: "Password do not match!",
    // },
  },
  isVerified:{
    type:Boolean,
    default:false,
  }
})

userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.email = encrypt(this.email);
  // this.passwordConfirm = '';
  next();
});

const User = mongoose.model("User", userSchema);
export default  User;