import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const createUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate EAch fields because each fields are required
        if (!username || !email || !password) {
            throw new ApiError('All fields are required', 401);
        }


        const existedUser = await User.findOne({
            $or: [{ username, email }]
        });

        if (existedUser) {
            throw new ApiError('User Already registered', 401);
        }


        const user = await User.create({
            username,
            email,
            password,
        })

        return res
            .status(200)
            .json(
                new ApiResponse(user, 'user signup successfully', 200)
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, error.message, false, 500)
            )
    }


})

const generateAccessTokenandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse({}, "something went wrong while generating accessToken and refreshToken")
            )
    }
}

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email) {
            throw new ApiError("All fields are required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            throw new ApiError("user doesn't exist", 404)
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError('password is wrong', 400)
        }


        const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user?._id)

        const loggedInuser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse({ loggedInuser, accessToken, refreshToken }, "user login successfully", 200)
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new A
            )
    }



})

const logoutUser = asyncHandler(async (req, res) => {
     await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse({},'user logout successfully',200)
    )
})


export { 
    createUser,
    loginUser,
    logoutUser,
}