import { asyncHandler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";






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

    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const avterlocalPath = req.files?.avater[0]?.path;
    console.log("avterlocalPath:", avterlocalPath);

    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("coverImageLocalPath:", coverImageLocalPath);

    if (!avterlocalPath) {
        throw new ApiError(400, "Avater image is required");
    }

    const avtar = await uploadToCloudinary(avterlocalPath);

    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avtar) {
        throw new ApiError(400, "Avater image is required");

    }

    const user = await User.create({
        fullname,
        avtar: avtar.url,
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

export { registerUser };