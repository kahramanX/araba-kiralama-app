//import files
const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');

let {
    check,
    validationResult
} = require("express-validator");


//session store
const MongoStore = require('connect-mongo')

//router
const userRoutes = require('./routes/userRoutes');

const app = express();

// db connection
mongoose.connect("mongodb+srv://mustafa:12345@cluster0.9qhig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
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
        maxAge: 30 * 60 * 1000 * 5000000, // session süresini belirler, süre bittiğinde db den silinir
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
    extended: false
}));

//static files
app.use("/public", express.static('public'));

const Country = require("./model/Country.js");

app.get('/', (req, res) => {
    let isAuth = req.session.isAuth;

    res.render("index", {
        isAuth
    });
})

app.post('/', (req, res) => {
    let isAuth = req.session.isAuth;

    let {
        provinces,
        districts,
        datetimes
    } = req.body;

    req.session.il = provinces;
    req.session.ilce = districts;
    req.session.purchaseDay = Number(datetimes.slice(0, 2));
    req.session.purchaseMonth = Number(datetimes.slice(3, 5));
    req.session.deliveryDay = Number(datetimes.slice(13, 15));
    req.session.deliveryMonth = Number(datetimes.slice(16, 18));

    console.log(req.body);

    if (provinces == undefined || districts == undefined) {

        res.render("index.ejs", {
            isAuth
        });
    }

    if (provinces !== undefined && districts !== undefined) {

        Country.findOne()
            .then((response) => {
                let country = response.turkey;

                for (let i = 0; i < country.length; i++) {

                    if (country[i].il == provinces) {

                        for (let j = 0; j < country[i].ilceler.length; j++) {

                            if (country[i].ilceler[j][0] == districts) {

                                let newProvince = country[i].il;
                                let newDistrict = country[i].ilceler[j][0];

                                res.redirect("/arac-secimi");
                            }
                        }
                    }
                }
            })
    }
})

// Router middleware
app.use(userRoutes);

// bilinmeyen route yapmak için
/* app.use((req, res) => {
    res.send("BİLİNMEYEN BİR ADRES GİRİLDİ!");
}) */

//listening
app.listen(process.env.PORT || 8080, () => {
    console.info("Server running on http://localhost:5000")
})