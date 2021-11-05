//import files
const express = require('express');
const path = require('path');

const app = express();

//static files
app.use("/", express.static('/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname +"/index.html");
})

//listening
app.listen(5000,()=>{console.log("Server running...")})