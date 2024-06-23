import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({path:"./.env"})

const DB = process.env.DATABASE?.replace(
  "<PASSWORD>",
process.env.DATABASE_PASSWORD!);


if(DB){
  mongoose.connect(DB)
  .then(()=>{
    console.log('Db connected successfully');
    const port = 8000;
    app.listen(port, ()=>{
      console.log(`App listening on port ${port}`);
      
    });
  })
  .catch((err)=>{
    console.error("Error connecting database: ", err)
  });
}