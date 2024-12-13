import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";


 const getAllCommentsOfBlog = asyncHandler(async (req, res) => {
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





 const postComment = asyncHandler(async(req,res)=>{
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

 const updateComment = asyncHandler(async(req,res)=>{
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

 const deleteComment = asyncHandler(async(req,res)=>{
     try {
        const {commentId} = req.params;
   
        if(!isValidObjectId(commentId)){
           throw new ApiError('commentId is not Valid',401)
        }
   
        const comment = await Comment.findOne({_id:commentId})

        if(comment.owner.toString() !== req.user?._id){
           throw new ApiError('you are not authorized user for delete this comment',401)
        }
   
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        
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


const addReplyCommentsInMainComment = asyncHandler(async(req,res)=>{
    try {
        const {commentId,replyCommentId} = req.params;

        if(!isValidObjectId(commentId)){
            throw new ApiError('commentId is not valid',401)
        }

        if(!isValidObjectId(replyCommentId)){
            throw new ApiError('replyCommentId is not valid',401)
        }

       const addedRepliedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $push:{
                    replyComments:replyCommentId 
                }
            },
            {
                new :true
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(addedRepliedComment,'add replied comment successfully in main Comment',200)
        )
        
        
        
    } catch (error) {
        
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while add replied comment  in main Comment',500)
        )
    }
})


const deleteRepliedCommentInMainComment = asyncHandler(async(req,res)=>{
    try {
        const {commentId,replyCommentId} = req.params;

        if(!isValidObjectId(commentId)){
            throw new ApiError('commentId is not valid',401)
        }

        if(!isValidObjectId(replyCommentId)){
            throw new ApiError('replyCommentId is not valid')
        }

        const removeRepliedCommentInMainComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $pull:{
                   replyComments:replyCommentId 
                }
            },
            {
                new:true
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(removeRepliedCommentInMainComment,'remove replied comment successfully in main Comment',200)
        )
        
        
        
    } catch (error) {
        return res
        .status(200)
        .json(
            new ApiResponse({},'remove replied comment successfully in main Comment',200)
        )
        
    }
})

const getAllRepliedCommentInMainComment = asyncHandler(async(req,res)=>{

    try {
        const {commentId} = req.params;
    
        if(!isValidObjectId(commentId)){
            throw new ApiError("commentId is not valid")
        }
    
        const allrepliedComments = await Comment.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(commentId),
                }
            },
            {
                $lookup:{
                    from:"replycomments",
                    localField:"replyComments",
                    foreignField:"_id",
                    as:"replyComments",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"replyBy",
                                foreignField:"_id",
                                as:"replyBy"
                            }
                        },
                    ]
                }
            },
        ])
    
        return res
        .status(200)
        .json(
            new ApiResponse(allrepliedComments,'get all replied comment successfully',200)
        )
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiResponse({},error.message || 'internal server problem while get all replied comments in main comment',500)
        )
    }

    

})



export {
    addReplyCommentsInMainComment,
    deleteRepliedCommentInMainComment,
    postComment,
    getAllCommentsOfBlog,
    updateComment,
    deleteComment,
    getAllRepliedCommentInMainComment,
}
