import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
       type:String,
       unique:true,
       lowercase:true,
       required:true, 
    },
   email:{
       type:String,
       unique:true,
       lowercase:true,
       required:true, 
    },
   password:{
       type:String,
       required:[true,"Password is required"], 
       min:6,
    },

},{timestamps:true});

export const User = mongoose.model('User',userSchema);