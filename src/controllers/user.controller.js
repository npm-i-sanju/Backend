import { asyncHandler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/uplod.js";
import ApiResponse from "../utils/ApiResponse.js";



const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return{ accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }

}


const registerUser = asyncHandler(async (req, res) => {
    // Registration logic goes here
    //get user details from frontend
    //validate user details
    //check if user already exists
    //check for image
    //check for avatar
    // upload image to cloudinary
    // create user object in db
    // remove password and refresh token from response
    // check for user creation success
    // respond returning user details

    const { fullname, email, username, password } = req.body;
    console.log("email:", email);

    if (fullname === "") {
        throw new ApiError(400, "Fullname is required");
    }
    if (email === "") {
        throw new ApiError(400, "Email is required");
    }
    if (username === "") {
        throw new ApiError(400, "Username is required");
    }
    if (password === "") {
        throw new ApiError(400, "Password is required");
    }
    // Alternative approach advanced
    // if([fullname,email,username,password].some(
    //     (field) => field?.trim() ===""
    // )){
    //     throw new ApiError(400, "All fields are required");
    // }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
    console.log("req.files:", req.files);

    // const avterlocalPath = req.files?.avater[0]?.path;    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatarLocalPath:", avatarLocalPath);

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    //console.log("coverImageLocalPath:", coverImageLocalPath);
    let coverImageLocalPath;




    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);

    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar image is required");

    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong user creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

})

const loginUser = asyncHandler(async (req, res) => {
    // Login logic goes here
    //get user details from frontend
    // find the user
    // password comparison 
    // access and refresh token generation
    // send cookies

    const { email, password, username } = req.body;
    console.log("email:", email);

    // if (email === "") {
    //     throw new ApiError(400, "Email is required");
    // }

    // if (password ==="") {
    //     throw new ApiError(400, "Password is required");
    // }

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User dosen't exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken (user._id)

const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

const cookieOptions = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.cookie("refreshToken", refreshToken, cookieOptions)
.cookie("accessToken", accessToken, cookieOptions)
.json(
    new ApiResponse(200, {
        user: logedInUser,
        refreshToken
    },"User logged in successfully")
)




})

const logedOutUser = asyncHandler (async (req,res) => {
    // Logout logic goes here
    // get user id from req.user
    // remove refresh token from db
    // clear cookies
    // send response


 await User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken: undefined
    }
 },{
    new: true
 })
const cookieOptions = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.clearCookie("refreshToken",cookieOptions)
.clearCookie("accessToken",cookieOptions)
.json(new ApiResponse(200, {},"User logged out successfully"))


})



export { registerUser, loginUser , logedOutUser};