const Blog = require('../models/Blog');

const fetchAllBlogs = async (req, res, next) =>{
    try {
        const blogs = await Blog.find();
        req.blogs = blogs;
        next();
    } catch(err){
        console.error("Error retrieving blogs: ", err);
        return res.status(500).json({ message: "Error retrieving blogs"});
    }
};

module.exports = fetchAllBlogs;