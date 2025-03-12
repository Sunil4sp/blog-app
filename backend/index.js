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
const PORT = process.env.PORT || 8000;
const { fetchUser } = require("./middlewares/fetchUser")
/* const api = process.env.API_URL; */

/* app.use(cors()) */
const corsOptions = {
    origin: "*",
    credential: true
};

app.use(cors(corsOptions));

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
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // You can change the folder where images will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
    },
    });
    
    const upload = multer({ 
        storage,
        limits: { fileSize: 5 * 1024 * 1024},    
    });
    
    // Route to handle profile picture upload
app.post(`/uploadProfilePicture/:userId`, upload.single('profilePicture'), async (req, res) => {
        try {
        const userId = req.params.userId;
        console.log("User ID from URL:", userId);

        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
    
        const decoded = jwt.verify(token, 'your_secret_key');
        console.log("Decoded Token:", decoded);
        console.log('Provided userId:', userId);

        if (decoded.userId !== userId) {
            console.log(`Token userId (${decoded.userId}) does not match URL userId (${userId})`);
            return res.status(403).json({ message: 'You are not authorized to update this profile' });
        }
    
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    
        // Update user's profile picture URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: imageUrl },
            { new: true }
        );
    
        res.json({
            message: 'Profile picture uploaded successfully',
            user: updatedUser,
            imageUrl,
        });
        } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Error uploading profile picture' });
        }
    });
    
    // Serve static files (image files)
app.use('/uploads', express.static('uploads'));
    

//middleware to handle json request body
app.use(bodyParser.json());

app.get('/', async (req, res) =>{
    console.log("Default Page");
    return res.status(200).json({message: "Default Page"});
})

//endpoints
app.post('/login', async (req, res) =>{
    /* res.send('Hello World!'); */
    const { email, password } = req.body;

    try{
        //find the user by email
        const user = await User.findOne({email});
        console.log(user);
        
        //If no user found return error
        if(!user){
            return res.status(401).json({message:"Invalid Credential"});
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
        password
    })
    try{
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email, password: newUser.password }
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

app.get("/profile",/* fetchUser, */ async (req, res) => {
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

  app.post('/posts', async (req, res) => {          //post new blog
    const { title, description, tag, imageUrl } = req.body;
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
            imageUrl,
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
/* app.get('/fetchAllBlogs/:id', async (req, res) => {
    const { userId } = req.user.id;

    try {
        const posts = await Post.find({ user: userId });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.status(200).json({ message: 'Posts retrieved successfully', posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
});
 */
app.get("/fetchBlogsByUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const blogs = await Blog.find({ user: userId });  // Assuming the Blog schema has a "user" field
        res.status(200).json({ blogs });
        } catch (error) {
        console.error("Error fetching blogs for user:", error);
        res.status(500).json({ message: "Error fetching blogs" });
        }
    });

app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);  // Find blog by ID
        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post retrieved successfully', post });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    });
    app.put('/updateBlog/:id', async (req, res) => {
        const { id } = req.params.id;  // Extract the blog ID from the route parameters
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
    
            res.status(200).json({ message: 'Post updated successfully', updatedPost });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

app.listen(PORT, (req, res) =>{
    ConnectDB();
    console.log(`Server is running at PORT ${PORT}`);
})