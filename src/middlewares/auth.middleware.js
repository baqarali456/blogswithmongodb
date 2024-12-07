import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req,res,next)=>{
   
        const token = req.body.accessToken || req.header('Authorization').slice(7);

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id)

        if(user?._id.toString() !== decodeToken?._id){
            throw new ApiError(404,'Unauthorized request')
        }

        req.user = user;
        next();

    
})