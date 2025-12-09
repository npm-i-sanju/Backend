import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        }, email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        }, avater: {
            type: String,
            required: true,
        }, watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video",
        }],password:{
            type: String,
            required:[true,"Password is required"],
            minlength:[6,"Password must be at least 6 characters long"]
        },refreshToken:{
            type: String,
        }
    },{ timestamps: true }
)

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    }
  )
}
userSchema.methods.gennerateRefreshToken = function (){
    jwt.sign({
        _id: this._id, 
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    }
)
}








export const User = mongoose.model("User", userSchema);