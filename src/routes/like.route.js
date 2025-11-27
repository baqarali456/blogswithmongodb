import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    TotalLikesofRepliedComment, TotalLikesofBlog, TotalLikesofComment, deleteLike, userLikeonBlog, userLikeonComment, updateLikeType,
} from "../controlllers/like.controller.js"

const likeRouter = Router();

likeRouter.use(verifyJWT);

likeRouter.route('/userLikeonBlog/:blogId').post(userLikeonBlog)

likeRouter.route('/userLikeonComment/:commentId').post(userLikeonComment)

likeRouter.route('/updateLikeType/:likeId').patch(updateLikeType)

likeRouter.route('/deleteLike/:likeId').delete(deleteLike)

likeRouter.route('/TotalLikesofComment/:commentId').get(TotalLikesofComment)

likeRouter.route('/TotalLikesofBlog/:blogId').get(TotalLikesofBlog)

likeRouter.route('/TotalLikesofRepliedComment/:replyCommentId').get(TotalLikesofRepliedComment)


export {likeRouter}