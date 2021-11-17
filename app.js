//import files
const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const app = express();

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

app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.post("/", (req, res) => {

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

app.get("/giris", (req, res) => {
    res.render("login.ejs");
})

app.post("/giris", (req, res) => {
    let { mail, password } = req.body;

    res.send(`Giriş yaptığınız mail:${mail} <br> Şifreniz: ${password}`);
})

app.get("/uye-ol", (req, res) => {
    res.render("register.ejs");
})

// bilinmeyen route yapmak için herhangi bir değer yazmamalıyız
/* app.use((req, res) => {
    res.send("BİLİNMEYEN BİR ADRES GİRİLDİ!");
}) */

//listening
app.listen(5000, () => {
    console.info("Server running on http://localhost:5000")
})