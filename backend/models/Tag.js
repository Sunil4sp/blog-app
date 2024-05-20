const mongoose = require("mongoose");
const User = require("./User");
const Blog = require("./Blog");
const Comment = require("./Comment");

const tagSchema = new mongoose.Schema({
    categoryName: String,
    Category: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        },
    ]
},{ timestamps: true });

module.exports = mongoose.Model("Tag", tagSchema);
