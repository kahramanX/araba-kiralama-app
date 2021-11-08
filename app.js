//import files
const express = require('express');
const path = require('path');
// const ejsLayouts = require('express-ejs-layouts');

const app = express();


// View engine - EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//static files
app.use("/public",express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render("index.ejs")
})

//listening
app.listen(5000, () => {
    console.log("Server running...")
})