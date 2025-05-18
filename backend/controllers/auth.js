const mongoose = require("mongoose");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretKey = "MilestoneProject";
const bcrypt = require("bcrypt");

const createUser = async (req, res) =>{
    const { username, password, email } = req.body;
    try{
        const userInput = new User({username, password, email});
        const user = await userInput.save();
        const token = jwt.sign(
            { username: user.username, email: user.email, userId: user._id },
            secretKey
            );
            return res
            .status(201)
            .json({ message: "User Registered sucessfully", token});
    } catch(err){
        return res
            .status(401)
            .json({ message: "User Registering Failed", status: "error"});
    }
};

const loginUser = async ( req, res) => {
    const { email, password } = req.body;
    try{
        if(!email || !password){
            return res
            .status(401)
            .json({ message: "email/password cannot be empty", 
            status: "error"});
        }
        const user = await User.findOne({ email });
        if(!user){
            return res
            .status(401)
            .json({ message: "email invalid", 
            status: "error"});
        }
            //check if password matches
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch)
                return res
                .status(401)
                .json({ message: "email/password invalid", 
                status: "error"});
            
            const token = jwt.sign(
                { /* username: user.username, */  email: user.email, userId: user._id },
                secretKey
                );
                return res
                .status(201)
                .json({ message: "login sucessfully", token});
    } catch(err){
        return res
            .status(401)
            .json({ message: "Auth Failed", status: "error"});
    }
};

const getUser = async(req, res) =>{
    const id = req.body.id;

    const user = User.findById(id).select("-password");
    return res.status(201).json({ user });
};

module.exports = { createUser, loginUser, getUser }