import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";


const createBlog = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title?.trim() || !content?.trim()) {
            throw new ApiError('All fields are required', 401);
        }

        const newblog = await Blog.create({
            title,
            content,
            createdBy: req.user?._id,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(newblog,'blog is successfully created', 200)
            )


    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, 'Internal server Problem while create blog', 500)
            )
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log(blogId,'blogId');
        const isValidBlogId = isValidObjectId(blogId);
       
        if (!isValidBlogId) {
            throw new ApiError('blog id is not valid', 401)
        }
        const { title, content } = req.body;
       

        if (!title?.trim() || !content?.trim()) {
            throw new ApiError('All fields are required', 401);
        }

        const blog = await Blog.findOne({ _id: blogId });
        console.log(blog,'blog');
         
        if (blog.createdBy !== req.user?._id) {
            throw new ApiError('you are not authorized user to update the blog');
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    title,
                    content,
                }
            },
            {
                new: true,
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(updatedBlog, 'blog updated successfully', 200)
            )



    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, 'internal server problem', 500)
            )

    }
})


const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const isValidBlogId = isValidObjectId(blogId)
    if (!isValidBlogId) {
        throw new ApiError('blog id is not valid', 401)
    }

    const blog = await Blog.findOne({ _id: blogId });

    if (blog.createdBy.toString() !== req.user?._id) {
        throw new ApiError('you are not authorized user to delete the blog')
    }

    const deletedBlog = await Blog.findByIdAndDelete(
        blogId,
    )
    if (!deletedBlog) {
        throw new ApiError("blog doesn't exist", 404)
    }

    return res
        .status(200)
        .json(
            new ApiResponse(deletedBlog, 'blog deleted successfully', 200)
        )
})

const userGetAllBlogs = asyncHandler(async (req, res) => {

    try {
        const { page = 1, limit = 10 } = req.query;
        const isValiduserId = isValidObjectId(userId)
        if (!isValiduserId) {
            throw new ApiError('user id is not valid', 401)
        }

        const blogsaggregate = await Blog.aggregate([
            {
                $match: {},
            },
            {
                $project: {
                    title: 1,
                    createdBy: 1,
                    content: 1,
                    totalLikesinBlog: 1,

                }
            }
        ]);

        const getAllBlogs = await Blog.aggregatePaginate(
            blogsaggregate,
            {
                page: Math.max(page, 1),
                limit: 10,
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

        )

        return res
            .status(200)
            .json(
                new ApiResponse(getAllBlogs, 'user get all blogs successfully', 200)
            )
    } catch (error) {
        return res
            .status(200)
            .json(
                new ApiResponse({}, error.message || 'failed to retrieve resource ', 500)
            )
    }

})








export {
    createBlog,
    deleteBlog,
    updateBlog,
    userGetAllBlogs,
}