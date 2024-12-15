import { Router } from "express";

import { createBlog,deleteBlog,updateBlog, userGetAllBlogs,} from "../controlllers/blog.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"



const blogRouter = Router();

blogRouter.use(verifyJWT);

blogRouter.route('/create-blog').post(createBlog)
blogRouter.route('/update-blog/:blogId').patch(updateBlog)
blogRouter.route('/delete-blog/:blogId').delete(deleteBlog)

blogRouter.route('/getAllBlogs').get(userGetAllBlogs)


export { blogRouter }