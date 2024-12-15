import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors(
    {
        origin:process.env.ORIGIN,
        credentials:true,
    }
));
app.use(cookieParser());
app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static('public'))


// import routes

import { userRouter } from "./routes/user.route.js";
import {likeRouter} from "./routes/like.route.js";
import {blogRouter} from "./routes/blog.route.js";
import {replyCommentRouter} from "./routes/replyComment.route.js";
import {commentRouter} from "./routes/comment.route.js"




app.use('/api/v1/users',userRouter);
app.use('/api/v1/blogs',blogRouter);
app.use('/api/v1/likes',likeRouter);
app.use('/api/v1/reply-comments',replyCommentRouter);
app.use('/api/v1/comments',commentRouter);


export {app}