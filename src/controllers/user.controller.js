import { asyncHandler } from "../utils/asyncHendler.js";


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
    
    const {fullname, email, username, passeord} = req.body;
    console.log("email:", email);
})

export { registerUser };