import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const replyCommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    replyBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',

    }
   
},{timestamps:true});

replyCommentSchema.plugin(mongooseAggregatePaginate)

export const ReplyComment = mongoose.model('ReplyComment',replyCommentSchema)