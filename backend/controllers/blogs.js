const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');

module.exports.post = async(req, res) =>{
    try{
        const id = req.params.id;
        const post = await Blog.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ post });
    } catch(error){
        console.error("Error fetching blogs for user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports.fetchBlogs = async (req, res) => {
    try {
        const userId = req.params.id;  // Get the userId from the request parameters
        console.log(userId);
        
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID", status: "error" });
          }

        // Check if the user exists (optional but good practice to verify)
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found", status: "error" });
        }
    
        // Fetch blogs that belong to the logged-in user
        const blogs = await Blog.find({ user: userId }).populate("user", "name email");
    
        if (!blogs.length) {
            return res.status(404).json({ message: "No blogs found for this user", status: "error" });
        }
    
        // Return the blogs to the frontend
        res.status(200).json({ blogs });
        } catch (error) {
        console.error("Error fetching blogs for user:", error);
        res.status(500).json({ message: "Internal Server Error" });
        }
    };

module.exports.addBlog = async (req, res) =>{

    try{
    const { title, description, tag, imageUrl } = req.body;
    const userId = req.user.id;

    const user = User.findById( userId );

    const blog = new Blog({
        title,
        description,
        tag,
        imageUrl,
        user: userId,
        username: user.username,
        upvote: 0,
        downvote: 0,
        comments: [],
    });
    const result = await blog.save();

    for (const tagContent of tag){
        const existingtag = await Tag.findOne({
            categoryName: tagContent
        });
        
        if (!existingtag){
            const newTag = new Tag({ categoryName: 
                tagContent, category: [newBlog._id], });

                await newTag.save();
        } else{
            existingtag.category.push(newBlog._id);
            await existingtag.save();
        }
    }
    res.status(200).json({ blog: newBlog});
} catch(e){
    console.log("error:"+ JSON.stringify(e));
    res.status(500).json({ message: "Internal Server Error"})
}
};

module.exports.deleteBlog = async (req, res) =>{

    try{
    const blogId = req.params.id;

    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    /* res.json({blog}); */

    if(!blog){
        return res.status(404).json({ message: "Blog not found"});
    }

    if(blog.user.toString() !== userId){
        return res
            .status(403)
            .json({ message: "Forbidden, you cannot delete someone else blog" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" })
    } catch(error){
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Internal Server Error"})
    } 
};

module.exports.updateBlog = async (req, res) =>{

    try{
    const blogId = req.params.id;
    const userId = req.user.id;

    console.log(blogId);
    

    const blog = await Blog.findById(blogId);

    if(!blog){
        return res.status(404).json({ message: "Blog not found",
        status: "error" });
    }

    if(blog.user.toString() !== userId){
        return res
        .status(403)
        .json({ message: "Forbidden, you cannot edit someone else blog",
        status: "error" });
    }

    if (req.body.title){
        blog.title = req.body.title;
    }
    if (req.body.description){
        blog.description = req.body.description;
    }
    if (req.body.tag){
        blog.tag = req.body.tag;
    }
    if (req.body.imageUrl){
        blog.imageUrl = req.body.imageUrl;
    }
    
    /* await Blog.findByIdAndUpdate(blogId, blog);*/
    const updatedBlog = await blog.save();

    res.status(200).json({status:"Success", blog: updateBlog })
    } catch(e){
        console.log("error:"+ JSON.stringify(e));
        res.status(500).json({ message: "Internal Server Error"})
    } 
};

module.exports.getComment = async(req, res) =>{
    const commentId = req.params.id;
    const comment = await Comment.findById({commentId});
    if(!comment){
        return res.status(404)
        .json({message: "Comment not found", status:"error"});
    }
    res.status(201).json({ comment });
};

module.exports.addComment = async (req, res) =>{

    try{
    const blogId = req.params.id;

    const { message, parentCommentId } = req.body;

    const blog = await Blog.findById(blogId);

    if(!blog){
        return res.status(404)
        .json({message: "Comment not found", status:"error"});
    }

    const newComment = new Comment ({
        user: req.user.id,
        message,
        parentComment: parentCommentId,
        blog: blogId,
        like: 0,
        isNested: !!parentCommentId,
    });

    await newComment.save();

    res.status(200).json({ newComment });
    } catch(e){
        console.log("error:"+ JSON.stringify(e));
        res.status(500).json({ message: "Internal Server Error"})
    }
};

module.exports.addVote = async (req, res) =>{
    try{
    const blogId = req.params.id;
    const userId = req.user.id;
    const { voteType } = req.body;

    const blog = Blog.findById(blogId);

    if(!blog){
        return res.status(404)
        .json({message: "Comment not found", status:"error"});
    }

    //check if user has already voted
    if(blog.votedBy.includes(userId)){
        return res.status(400)
        .json({message: "User has voted", status:"error"});
    }

    blog.upvote = voteType === 'upvote'? blog.upvote+1 :
    blog.upvote;
    blog.downvote = voteType === 'downvote'? blog.downvote+1 :
    blog.downvote;

    blog.votedBy.push(userId);

    const newBlog = await blog.save();
    re.status(200).json({message: "Voted successfully",
    blog: newBlog })
    } catch(e){
        console.log("error:"+ JSON.stringify(e));
        res.status(500).json({ message: "Internal Server Error"})
    }
};
