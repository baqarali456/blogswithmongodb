import  {
    replyonComments,
    updateRepliedComment,
    deleteRepliedComment,
    getAllRepliedCommentsOfSingleComment
} from "../controlllers/replyComment.controller.js";

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const replyCommentRouter = Router();

replyCommentRouter.use(verifyJWT);

replyCommentRouter.route('/replyonComments/:commentId').post(replyonComments)
replyCommentRouter.route('/updateRepliedComment/:replyCommentId').patch(updateRepliedComment)
replyCommentRouter.route('/deleteRepliedComment/:replyCommentId').post(deleteRepliedComment)
replyCommentRouter.route('/getAllRepliedCommentsOfSingleComment/:commentId').post(getAllRepliedCommentsOfSingleComment)

export {
    replyCommentRouter
}