const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 8080;

//connect to Db
function ConnectToMongoDb(){
    try{
        mongoose.connect(dbUrl);
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

app.listen(PORT, (req, res) =>{
    console.log(`Server is running at ${PORT}`);
})