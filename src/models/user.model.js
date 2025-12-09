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


export const User = mongoose.model("User", userSchema);