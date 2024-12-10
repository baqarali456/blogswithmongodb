import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js"

export const getAllCommentsOfBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.params;

        const { page = 1, limit = 10 } = req.query;

        const isValidBlogId = isValidObjectId(blogId);

        if (!isValidBlogId) {
            throw new ApiError("blogId is not valid", 401);
        }

        const blogcommentsaggreagate = await Comment.aggregate([
            {
                $match: {
                    BlogId: new mongoose.Types.ObjectId(blogId),
                },
            },
            {
                $lookup:{
                    from:'users',
                    localField:'owner',
                    foreignField:'_id',
                    as:'owner',
                    pipeline:[
                        {
                            $project:{
                                username:1,
                            }
                        }
                    ]
                }
            }
        ]);

        const allComments = await Comment.aggregatePaginate(blogcommentsaggreagate, {
            pagination: true,
            page: page,
            limit: parseInt(limit),
            customLabels: {
                customLabels: {
                    totalDocs: 'itemCount',
                    docs: 'itemsList',
                    limit: 'perPage',
                    page: 'currentPage',
                    nextPage: 'next',
                    prevPage: 'prev',
                    totalPages: 'pageCount',
                    hasPrevPage: 'hasPrev',
                    hasNextPage: 'hasNext',
                    pagingCounter: 'pageCounter',
                    meta: 'paginator',

                }
            }
        })

        return res
            .status(200)
            .json(
                new ApiResponse(allComments, 'get all comments successfully of blog', 200)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, error.message || 'internal server problem', 500)
            )
    }
});


export const getTotalLikesOfComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;

        const isValidCommentId = isValidObjectId(commentId)

        if (!isValidCommentId) {
            throw new ApiError('CommentId is not Valid');
        }

        const totalLikesinComment = await Like.find({ commentId: commentId }).count();

        return res
            .status(200)
            .json(
                new ApiResponse(totalLikesinComment, 'get successfully total likes of comment', 200)
            )


    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, error.message || 'internal server problem', 500)
            )
    }
})


export const postComment = asyncHandler(async(req,res)=>{
     try {
         const {content} = req.body;
         
         const {blogId} = req.params;

         const isValidblogId = isValidObjectId(blogId);

         if(!isValidblogId){
            throw new ApiError('blogId is not valid',401);
         }

         if(!content?.trim()){
            throw new ApiError('content is required',401)
         }

         const createdComment = await Comment.create({
            content,
            BlogId:blogId,
            owner:req.user._id
         });

         return res
         .status(200)
         .json(
            new ApiResponse(createdComment,'comment is created',200),
         )

     } catch (error) {
        
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while create the comment',500),
        )
     }
})

export const updateComment = asyncHandler(async(req,res)=>{
    try {
        const {content} = req.body;
        const {commentId} = req.params;

        if(!isValidObjectId(commentId)){
            throw new ApiError('commentId is not valid',401)
        }

        if(!content?.trim()){
            throw new ApiError('content is required',401);
        }

        const comment = await Comment.findOne({_id:commentId});

        if(comment.owner !== req.user?._id){
            throw new ApiError('you are not authorized user to update the comment',401);
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
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
            new ApiResponse(updatedComment,'comment update successfully',200)
        )
        
        
        
    } catch (error) {
        
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while updating comment',500)
        )
    }
})

export const deleteComment = asyncHandler(async(req,res)=>{
     try {
        const {commentId} = req.params;
   
        if(!isValidObjectId(commentId)){
           throw new ApiError('commentId is not Valid',401)
        }
   
        const comment = await Comment.findOne({_id:commentId})

        if(comment.owner !== req.user?._id){
           throw new ApiError('you are not authorized user for delete this comment',401)
        }
   
        const deletedComment = await Comment.findByIdAndDelete(commentId)
        if(!deletedComment){
           throw new ApiError('comment does not exist',404 )
        }
   
        return res
        .status(200)
        .json(
           new ApiResponse(deletedComment,'delete comment successfully',200)
        )
     } catch (error) {
        
         return res
         .status(500)
         .json(
             new ApiResponse({},error.message || 'internal server problem while deleting comment',500)
         )
     }


})
