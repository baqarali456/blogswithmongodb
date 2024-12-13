import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", 
    },
    BlogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    replyCommentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReplyComment",
    },
    likeType: {
      type: String,
      enum: ["👍", "❤️", "😂"],
      default:"👍",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
