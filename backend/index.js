const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const User = require("./models/User");
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;
/* const api = process.env.API_URL; */

app.use(cors())
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

//endpoints
app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.post('/signup', async(req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const formData = new User({
        username,
        email,
        password
    })
    try{
        await formData.save();
        res.send("Data inserted..");
    } catch(err){
        console.log(err);
    }
});

app.listen(PORT, (req, res) =>{
    ConnectDB();
    console.log(`Server is running at PORT ${PORT}`);
})