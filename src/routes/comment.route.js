import {Router } from "express";

import {
    addReplyCommentsInMainComment,
    deleteRepliedCommentInMainComment,
    postComment,
    getAllCommentsOfBlog,
    updateComment,
    deleteComment,
    getAllRepliedCommentInMainComment,
    
} from '../controlllers/comment.controller.js';

import { verifyJWT } from "../middleware/auth.middleware.js"

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route('/create-comment/:blogId').post(postComment)

commentRouter.route('/update-comment/:commentId').patch(updateComment)

commentRouter.route('/delete-comment/:commentId').delete(deleteComment)

commentRouter.route('/getAllCommentsOfBlog/:blogId').get(getAllCommentsOfBlog)

commentRouter.route('/getTotalLikesOfComment/:commentId').get(getTotalLikesOfComment)

commentRouter.route("/getAllRepliedCommentInMainComment/:commentId").get(getAllRepliedCommentInMainComment)

commentRouter.route("/addReplyCommentsInMainComment/:commentId/:replyCommentId").post(addReplyCommentsInMainComment)

commentRouter.route("/deleteRepliedCommentInMainComment/:commentId/:replyCommentId").post(deleteRepliedCommentInMainComment)


export {commentRouter}