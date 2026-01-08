import { Router } from "express";
import { 
    createUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../controlllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = Router();

userRouter.route('/signup').post(createUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(verifyJWT,logoutUser);
userRouter.route('/getCurrentUser').get(verifyJWT,getCurrentUser)




export { userRouter }