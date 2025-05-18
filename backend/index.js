const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const User = require("./models/User");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const Post = require("./models/Blog");
const path = require('path');
const fs = require('fs');
/* const fetchUser = require('./middlewares/fetchUser'); */
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: "*",
    credential: true
};

app.use(cors(corsOptions));
app.use("/blogs", Post);

//connect to Db
const ConnectDB = async() =>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    } catch(err){
        console.error("Cannot connect to DB",err);
    }
}

// Multer configuration to save files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  const upload = multer({ storage });
    
    // Route to handle profile picture upload
app.post('/uploadProfilePicture/:id', upload.single('profilePicture'), async (req, res) => {
            const userId = req.params.id;
        
            if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
            }
        
            const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        
            try {
            const user = await User.findByIdAndUpdate(
                userId,
                { profilePicture: imageUrl },
                { new: true } // Return the updated user
            );
        
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        
            res.json({ message: 'Profile picture uploaded successfully', imageUrl });
            } catch (err) {
            console.error('Upload error:', err);
            res.status(500).json({ error: 'Server error during upload' });
            }
        });
        
    
    // Serve static files (image files)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    

//middleware to handle json request body
app.use(bodyParser.json());

app.get('/', async (req, res) =>{
    return res.status(200).json({message: "Default Page"});
})

//endpoints
app.post('/login', async (req, res) =>{

    const { email, password } = req.body;

    try{
        //find the user by email
        const user = await User.findOne({email});
        console.log(user);
        
        //If no user found return error
        if(!user){
            return res.status(401).json({message:"No User"});
        }
        //Compare passowrd
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        //create jwt token
        const token = jwt.sign({ userId: user._id}, 'your_secret_key',{ expiresIn: '1d'});

        //return the token
        res.json({ 
            token, 
            user: { _id: user._id, username: user.username, email: user.email }});
        
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error'});
    }
});

app.post('/register', async(req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email or username." });
    }

    const newUser = new User({
        username,
        email,
        password,
    })
    try{
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email/* , password: newUser.password */ }
        });
    } catch(err){
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
});

//Handling user logout 
app.get("/logout", (req, res)=> {
    res.status(200).json({ message: "Logged out successfully."});
});

app.get("/profile", /* fetchUser, */ async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        res.json({ user: { ...user.toObject(), profilePicture: user.profilePicture } });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
    });

app.put('/editProfile', /* fetchUser, */ async (req, res) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
    
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.userId;
    
        const { username, password, imageUrl } = req.body;
    
        const updateData = {};
        if (username) updateData.username = username;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (password) updateData.password = await bcrypt.hash(password, 10);
    
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
        res.json({ user: updatedUser });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Error updating profile" });
    }
});

  app.post('/posts', /* fetchUser, */ async (req, res) => {          //post new blog
    const { title, description, tag } = req.body;
    const token = req.headers['authorization'].split(' ')[1]; // Extract token
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    try {
      // Verify the token
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.userId;
    
        // Create the post
        const newPost = new Post({ 
            title, 
            description, 
            tag,
            user: userId,
            /* username: decoded.username */
        });
        await newPost.save();
    
        res.status(201).json({ message: 'Post created successfully', post: newPost, userId: userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    });
  
// Fetch all blogs posts for the logged-in user
app.get('/fetchAllBlogs', async (req, res) => {
    /* const { userId } = req.user; */

    try {
        const posts = await Post.find();

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.status(200).json({ message: 'Posts retrieved successfully', posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
});

app.get("/fetchBlogs/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("User ID:", userId);
        
        const blogs = await Post.find({ user: userId });  // Assuming the Blog schema has a "user" field
        res.status(200).json({ blogs });
        } catch (error) {
        console.error("Error fetching blogs for user:", error);
        res.status(500).json({ message: "Error fetching blogs" });
        }
    });

app.get('/post/:id', /* fetchUser, */ async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json({ message: 'Post retrieved successfully', post }); /* } */
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    });
app.put('/updateBlog/:id', async (req, res) => {

        const { id } = req.params;  // Extract the blog ID from the route parameters
        const { title, description } = req.body;  // Assuming title and description are being updated
    
        try {
            // Find the blog post by ID
            const post = await Post.findById(id);
    
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
    
            // Update the blog with the new data (title, description, etc.)
            post.title = title || post.title;  // Only update if a new title is provided
            post.description = description || post.description;  // Only update if a new description is provided
            
            // Save the updated blog post to the database
            const updatedPost = await post.save();
    
            res.status(200).json({ message: 'Post updated successfully', blog: updatedPost });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

app.delete('/deleteBlog/:id', /* fetchUser, */ async (req, res) => {
        try{
            const blogId = req.params.id;
            
            const userId = req.user.id;
        
            const blog = await Post.findById(blogId);
            console.log(blogId, blog);
        
            if(!blog){
                return res.status(404).json({ message: "Blog not found",
                status: "error" });
            }
        
            if(blog.user.toString() !== userId){
                return res
                    .status(403)
                    .json({ message: "Forbidden, you cannot delete someone else blog",
                    status: "error" });
            }
            await Post.findByIdAndDelete(blog);
        
            res.status(200).json({status:"Success", message: "Blog deleted successfully", blogId })
            } catch(error){
                console.error("Error deleting blog:", error);
                res.status(500).json({ message: "Internal Server Error"})
            } 
    });

app.post('/addVote/:id', /* fetchUser, */ async (req, res) => {  
        try{
            const blogId = req.params.id;
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "No token provided" });

            const decoded = jwt.verify(token, 'your_secret_key');
            const userId = decoded.userId;

            const { voteType } = req.body;
        
            const blog = await Post.findById(blogId);
            console.log("Blog: ",blog);
        
            if(!blog){
                return res.status(404).json({message: "Blog not found", status:"error"});
            }
        
            //check if user has already voted
            if(blog.votedBy.includes(userId)){
                return res.status(400)
                .json({message: "User has already voted", status:"error"});
            }
            /* blog.upvote = voteType === 'upvote'? blog.upvote+1 :
            blog.upvote;
            blog.downvote = voteType === 'downvote'? blog.downvote+1 :
            blog.downvote; */
        
            if (voteType === 'upvote') {
                blog.upvote += 1;
                } else if (voteType === 'downvote') {
                    blog.downvote += 1;
                    if (blog.upvote > 0) blog.upvote -= 1; // reduce one like if downvoted
                } else {
                    return res.status(400).json({ message: "Invalid vote type" });
                }
        
            blog.votedBy.push(userId);
            const newBlog = await blog.save();

            res.status(200).json({message: "Voted successfully", blog: newBlog })
            } catch(e){
                console.log("error:"+ JSON.stringify(e));
                res.status(500).json({ message: "Internal Server Error"})
            }
    });

app.listen(PORT, (req, res) =>{
    ConnectDB();
    console.log(`Server is running at PORT ${PORT}`);
})
