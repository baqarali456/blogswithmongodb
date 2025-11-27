import { connectDB } from "./src/db/db.js";
import { app } from "./src/app.js";

import dotenv from "dotenv";
dotenv.config();

connectDB()
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log('SERVER LISTENING ON PORT ',process.env.PORT);
  })
  app.on('err',(error)=>{
    console.log('Error :',error)
    throw error;
    
  })
})
.catch((error)=>{
  console.log('Mongodb connection failed ',error)
  
})

































// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constant.js";

// const app = express();
// ;(async () => {
//     try {
//       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//       console.log(connectionInstance)
      
//        app.on('error',(err)=>{
//         console.log('Error :',err)
//         throw err;
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log('Server listening on Port ',process.env.PORT);
        
//        })
//     } catch (error) {
//         console.log('Error: ',error)
//     }
// })