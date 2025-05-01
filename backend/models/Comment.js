const mongoose = require("mongoose");

const commentSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    like: Number,
    isNested: Boolean,
    comments: [this],
},
    { timestamps: true }
);


module.exports = mongoose.model('Comment', commentSchema);