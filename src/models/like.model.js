import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Baqar
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // null
    },
    BlogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
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
