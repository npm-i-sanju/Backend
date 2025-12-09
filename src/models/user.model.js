import mongoose, { Schema } from "mongoose";

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


export const User = mongoose.model("User", userSchema);