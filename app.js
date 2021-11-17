//import files
const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const app = express();

const userRoutes = require('./routes/userRoutes');

//router
//const searchRouter = require('./routes/searchRouter')

// EJS layouts
app.use(ejsLayouts);

// View engine - EJS
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");


// express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router middleware
//app.use(searchRouter);

//static files
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(userRoutes);

app.get('/', (req, res) => {
    res.render("index");
})

// bilinmeyen route yapmak için herhangi bir değer yazmamalıyız
/* app.use((req, res) => {
    res.send("BİLİNMEYEN BİR ADRES GİRİLDİ!");
}) */

//listening
app.listen(5000, () => {
    console.info("Server running on http://localhost:5000")
})