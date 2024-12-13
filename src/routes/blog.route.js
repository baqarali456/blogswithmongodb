import { Router } from "express";

import { createBlog,deleteBlog,updateBlog, userGetAllBlogs,} from "../controlllers/blog.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"



const blogRouter = Router();

blogRouter.route('/create-blog').post(verifyJWT, createBlog)
blogRouter.route('/update-blog/:blogId').patch(verifyJWT, updateBlog)
blogRouter.route('/delete-blog/:blogId').delete(verifyJWT, deleteBlog)


export { blogRouter }