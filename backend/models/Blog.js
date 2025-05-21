const mongoose = require('mongoose');

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
        /* required: true, */
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: String,
    upvote: {
        type: Number,
        default: 0
    },
    downvote: {
        type: Number,
        default: 0
    },
    votedBy: [{
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String, // 'upvote' or 'downvote'
        enum: ['upvote', 'downvote']
    }
    }],
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);