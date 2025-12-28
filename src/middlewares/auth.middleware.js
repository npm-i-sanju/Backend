import { asyncHandler } from "../utils/asyncHandler.js";


const veryfyJWT = asyncHandler(async (req , res , next) =>{
    // JWT verification logic will be here
    req.cookies.a
})