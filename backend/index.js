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

const PORT = process.env.PORT || 8000;
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
        mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    } catch(err){
        console.error("Cannot connect to DB");
    }
}


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
        const token = jwt.sign({ userId: user._id}, 'your_secret_key',{ expiresIn: '1h'});

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
app.get("/logout", async (req, res)=> {
    try {
        req.session.destroy();
        await newUser.clear();
        res.redirect('/');
    } catch(err){
        console.error('Error during logout:', err);
        res.status(500).send('Logout failed. Please try again later.');
    }
});

app.listen(PORT, (req, res) =>{
    ConnectDB();
    console.log(`Server is running at PORT ${PORT}`);
})