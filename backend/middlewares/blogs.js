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

const post = async (req, res, next) =>{
    const id = Blog._id;
    try{
        const posts = await Blog.findById(id);
        req.posts = posts;
        next();
    } catch(err){
        console.error("Error retrieving blogs: ", err);
        return res.status(500).json({ message: "Error retrieving blogs content"});
    }
}

module.exports = fetchAllBlogs, post;