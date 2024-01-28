const express = require('express');
const mongoose = require('mongoose');
/* const bodyParser = require("body-parser"); */
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;

//connect to Db
function ConnectToMongoDb(){
    try{
        mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    } catch(err){
        console.error("Cannot connect to DB");
    }
}

ConnectToMongoDb();

//middleware to handle json request body
app.use(express.json());

//endpoints
app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.get("/hello", (req, res) => {
    res.send("Hello, Postman!");
});

app.listen(PORT, (req, res) =>{
    console.log(`Server is running at PORT ${PORT}`);
})