import  { Router } from "express";
import { loginUser, registerUser ,logedOutUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { veryfyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",// fist field name form frontend
            maxCount:1
        },{
            name:"coverImage",// second field name form frontend
            maxCount:1
        }
    ]),
    registerUser
);

 router.route("/login").post(loginUser);

 //secure routes

 router.route("/logout").post(veryfyJWT, logedOutUser);

export default router;