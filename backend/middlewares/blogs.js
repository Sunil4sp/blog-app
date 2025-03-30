const Blog = require('../models/Blog');

const fetchBlogs = async (req, res, next) =>{
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const blogs = await Blog.find({ user: userId }).populate("user", "name email");
        console.log(blogs);
        

        if (!blogs.length) {
            return res.status(404).json({ message: "No blogs found for this user" });
        }

        req.blogs = blogs;
        next();

    } catch(err){
        console.error("Error retrieving blogs: ", err);
        return res.status(500).json({ message: "Error retrieving blogs"});
    }
};

const post = async (req, res, next) =>{
    try{
        const posts = await Blog.findById(req.params.id);
        if (!posts) {
            return res.status(404).json({ message: "Post not found" });
        }
        req.posts = posts;
        next();
    } catch(err){
        console.error("Error retrieving blogs: ", err);
        return res.status(500).json({ message: "Error retrieving blogs content"});
    }
}

const edit = async (req, res, next) =>{
    const id = req.params.id; Blog._id; 
    try{
        const editBlog = await Blog.findById(id);
        if (!editBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        req.editBlog = editBlog;
        next();
    } catch(err){
        console.error("Error editing blog.", err);
        return res.status(500).json({ message: "Error editing blogs"});
    }
}


module.exports = fetchBlogs, post, edit;