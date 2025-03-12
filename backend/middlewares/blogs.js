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
    const id = req.params.id; /* Blog._id; */
    try{
        const posts = await Blog.findById(id);
        req.posts = posts;
        next();
    } catch(err){
        console.error("Error retrieving blogs: ", err);
        return res.status(500).json({ message: "Error retrieving blogs content"});
    }
}

/* const edit = async (req, res, next) =>{
    const id = req.params.id;/* Blog._id; 
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
 */
module.exports = fetchAllBlogs, post/* , edit */;