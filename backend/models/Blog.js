const mongoose =require('mongoose');

const blogSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        min: 3,
    },
    description: {
        type: String,
        required: true,
        min: 3,
    },
    tag: {
        type: [String],
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    username: String,
    upvote: Number,
    downvote: Number,
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
}, { timestamps });

module.exports = mongoose.Model("Blog", blogSchema);