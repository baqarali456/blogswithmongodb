import {Router } from "express";

import { postComment,updateComment ,deleteComment,getAllCommentsOfBlog} from '../controlllers/comment.controller.js';

import {verifyJWT} from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.route('/create-comment').post(postComment)
commentRouter.route('/update-comment/:commentId').patch(updateComment)
commentRouter.route('/delete-comment/:commentId').delete(deleteComment)
commentRouter.route('/getAllCommentsOfBlog/:blogId').get(getAllCommentsOfBlog)
commentRouter.route('/getTotalLikesOfComment/:commentId').get(getTotalLikesOfComment)


export {commentRouter}