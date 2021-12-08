//import files
const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');

//session store
const MongoStore = require('connect-mongo')

//router
const userRoutes = require('./routes/userRoutes');

const app = express();

// db connection
mongoose.connect("mongodb+srv://mustafa:12345@cluster0.9qhig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (error) => {
    if (!error) {
        console.log("Database bağlandı!");
    } else {
        console.log("Database bağlanamadı!");
    }
})


// session start
app.use(session({
    secret: 'secretKey',
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://mustafa:12345@cluster0.9qhig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    }),
    resave: true,
    saveUninitialized: true, // true ise session store'a kaydediliyor.
    cookie: {
        maxAge: 30 * 60 * 1000, // session süresini belirler, süre bittiğinde db den silinir
        secure: false
    }
}))


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
app.use("/public", express.static('public'));


app.get('/', (req, res) => {
    let isAuth = req.session.isAuth;

    res.render("index", {isAuth});
})


app.post('/', (req, res) => {

    let {
        provinces: province,
        districts: district
    } = req.body;

    if (province == undefined || district == undefined) {

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
app.listen(process.env.PORT || 5000, () => {
    console.info("Server running on http://localhost:5000")
})