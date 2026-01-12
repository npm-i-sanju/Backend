import { asyncHandler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js"
import { isValidObjectId } from "mongoose";


const videoLike = asyncHandler(async (req, res) => {

    const { VideoId } = req.params // video id validation

    if (!VideoId || !isValidObjectId(VideoId)) { 
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(VideoId) // check video existence

    if (!video) {
        throw new ApiError(404, "Video not found")

    }


    const existingLike = await Like.findOne({
        video: VideoId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "liked removed successfully"))
    } else {
        const newLike = await Like.create({
            video: VideoId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: true }, "liked add successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export { videoLike }