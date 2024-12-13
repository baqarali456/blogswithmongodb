import {isValidObjectId} from "mongoose";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ReplyComment} from "../models/replyComments.model.js"






const replyonComments = asyncHandler(async(req,res)=>{
     try {
        const {content} = req.body;
        const {commentId} = req.params;

        if(!isValidObjectId(commentId)){
            throw new ApiError("commentId is not valid",401);
        }

        if(!content?.trim()){
            throw new ApiError("content is required",401)
        }

        const repliedComment = await ReplyComment.create({
            content,
            replyBy:req.user._id,
            
        })

        

        return res
        .status(200)
        .json(
            new ApiResponse({repliedComment},`user successfully replied on comment ${commentId}`,200)
        )
        
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiResponse({},`internal server problem while user  replied on comment `,500)
        )
        
    }
})


const updateRepliedComment = asyncHandler(async(req,res)=>{
    try {
        const {replyCommentId} = req.params;

        const {content} = req.body;

        if(!isValidObjectId(replyCommentId)){
            throw new ApiError("replyCommentId is not valid",401);
        }

        if(!content?.trim()){
            throw new ApiError("content is required",404);
        }

        const replycomment = await ReplyComment.findOne({_id:replyCommentId})

        if(replycomment?.replyBy.toString() !== req.user._id){
            throw new ApiError("you are not authorized user to update this comment",404);
        }

       const updatedRepliedComment = await ReplyComment.findByIdAndUpdate(
            replyCommentId,
            {
                $set:{
                    content,
                }
            },
            {
                new:true
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse({updatedRepliedComment},'update Replied Comment Successfully',200)
        )
        
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while update Replied Comment',500)
        )
        
    }
})

const deleteRepliedComment = asyncHandler(async(req,res)=>{
    try {
        const {replyCommentId} = req.params;

        const {content} = req.body;

        if(!isValidObjectId(replyCommentId)){
            throw new ApiError("replyCommentId is not valid",401);
        }

        if(!content?.trim()){
            throw new ApiError("content is required",404);
        }

        const replycomment = await ReplyComment.findOne({_id:replyCommentId})

        if(replycomment?.replyBy.toString() !== req.user._id){
            throw new ApiError("you are not authorized user to update this comment",404);
            
        }

       const deletedRepliedComment = await ReplyComment.findByIdAndDelete(replyCommentId);

       if(!deletedRepliedComment){
        throw new ApiError('replied Comment does not exist');
       }

        return res
        .status(200)
        .json(
            new ApiResponse({deletedRepliedComment},'delete Replied Comment Successfully',200)
        )
        
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while delete Replied Comment',500)
        )
        
    }
})




export {
    replyonComments,
    updateRepliedComment,
    deleteRepliedComment
}