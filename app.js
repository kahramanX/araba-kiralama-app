//import files
const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
// const passport = require('passport');
const app = express();

// db connection
mongoose.connect("mongodb+srv://mustafa:12345@cluster0.9qhig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (error) => {
    if (!error) {
        console.log("Database bağlandı!");
    } else {
        console.log("Database bağlanamadı!");
    }
})

//start passport
// passport.initialize();

// session start
app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

//router
const userRoutes = require('./routes/userRoutes');

// EJS layouts
app.use(ejsLayouts);

// View engine - EJS
app.set("view engine", "ejs");
app.set("layout", "./layouts/layout");


// express body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//static files
app.use("/public", express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render("index");
})


app.post('/', (req, res) => {

    let {
        provinces: province,
        districts: district
    } = req.body;

    if (province == undefined || district == undefined) {

        //res.send("il ve ilçeyi seçmeniz gerekiyor");
        res.render("index.ejs", );
    }
    if (province !== undefined && district !== undefined) {
        res.redirect(`${province}/${district}`);
    }
})

// Router middleware
app.use(userRoutes);

// bilinmeyen route yapmak için
app.use((req, res) => {
    res.send("BİLİNMEYEN BİR ADRES GİRİLDİ!");
})

//listening
app.listen(5000, () => {
    console.info("Server running on http://localhost:5000")
})