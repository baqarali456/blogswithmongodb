import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";

 const userLikeonBlog = asyncHandler(async(req,res)=>{
     const {blogId} = req.params;

     const {likeType} = req.body;

     if(!isValidObjectId(blogId)){
         throw new ApiError('blogId is not valid',401)
     }

     const existedLikeonBlog = await Like.findOne({BlogId:blogId,likedBy:req.user?._id});

     if(existedLikeonBlog){
         throw new ApiError('you already like this blog',401);
     }
     
     
     const like = await Like.create({
         likedBy:req.user._id,
         BlogId:blogId,
         likeType,     
     });

     return res
     .status(200)
     .json(
         new ApiResponse(like,'like the blog successfully',200)
     )
    
})

const userLikeonComment = asyncHandler(async(req,res)=>{
     const {commentId} = req.params;
     
     const {likeType} = req.body;
     
     if(!isValidObjectId(commentId)){
         throw new ApiError('blogId is not valid',401)
     }
     const existedLikeonComment = await Like.findOne({commentId:commentId,likedBy:req.user?._id});
     
     if(existedLikeonComment){
         throw new ApiError('you already like this blog',401);
     }
     
     const like = await Like.create({
         likedBy:req.user._id,
         commentId,
         likeType,     
     })
     
     return res
     .status(200)
     .json(
         new ApiResponse(like,'like the blog successfully',200)
     )
    
})

 const updateLikeType = asyncHandler(async(req,res)=>{
     const {likeType="👍"} = req.body;
     const {likeId} = req.params;

     if(!isValidObjectId(likeId)){
         throw new ApiError('likeId is not valid')
     }

     const like = await Like.findOne({_id:likeId});

     if(like.likedBy.toString() !== req.user?._id){
         throw new ApiError('you are not authorized user to update the like on blog',401);
     }

     const updatedLike = await Like.findByIdAndUpdate(
         likeId,
         {
             $set:{
                 likeType,
             }
         },
         {
             new :true,
         }
     )

     return res
     .status(200)
     .json(
         new ApiResponse(updatedLike,'successfully update likeType',200)
     )
    
})

 const deleteLike = asyncHandler(async(req,res)=>{
     const {likeId} = req.params;

     if(!isValidObjectId(likeId)){
         throw new ApiError('likeId is not valid')
     }

     const like = await Like.findOne({_id:likeId});

     if(like.likedBy.toString() !== req.user?._id){
         throw new ApiError('you are not authorized user to update the like on blog',401);
     }
     
     const updatedLike = await Like.findByIdAndDelete(
         likeId,
     )

     return res
     .status(200)
     .json(
         new ApiResponse(updatedLike,'successfully update likeType',200)
     )
    
})

 const TotalLikesofBlog = asyncHandler(async(req,res)=>{
     const {blogId} = req.params;
     if(!isValidObjectId(blogId)){
         throw new ApiError("blogId is not valid",401);
     }

     const totalLikes = await Like.find({BlogId:blogId}).count();

     return res
     .status(200)
     .json(
         new ApiResponse(totalLikes,'get totalLikes of Blog',200)
     )
    
})

 const TotalLikesofComment = asyncHandler(async(req,res)=>{
     const {commentId} = req.params;
     if(!isValidObjectId(commentId)){
         throw new ApiError("commentId is not valid",401);
     }

     const totalLikes = await Like.find({commentId}).count();

     return res
     .status(200)
     .json(
         new ApiResponse(totalLikes,'get totalLikes of Blog',200)
     )
    
})

 const TotalLikesofRepliedComment = asyncHandler(async(req,res)=>{
     const {replyCommentId} = req.params;
     if(!isValidObjectId(replyCommentId)){
         throw new ApiError("commentId is not valid",401);
     }

     const totalLikes = await Like.find({replyCommentId}).count();

     return res
     .status(200)
     .json(
         new ApiResponse(totalLikes,'get totalLikes of Blog',200)
     )
    
})

export {
    TotalLikesofRepliedComment,
    TotalLikesofBlog,
    TotalLikesofComment,
    deleteLike,
    userLikeonBlog,
    userLikeonComment,
    updateLikeType,
}