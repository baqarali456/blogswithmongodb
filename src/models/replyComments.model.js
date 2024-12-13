import mongoose from "mongoose";

const replyCommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    replyBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
   
},{timestamps:true})

export const ReplyComment = mongoose.model('ReplyComment',replyCommentSchema)