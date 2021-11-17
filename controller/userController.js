module.exports.postHomePage = (req, res) => {

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
};

module.exports.getGirisPage = (req, res) => {
    res.render("login.ejs");
}

module.exports.postGirisPage = (req, res) => {
    let { mail, password } = req.body;

    res.send(`Giriş yaptığınız mail:${mail} <br> Şifreniz: ${password}`);
}

module.exports.getKayitPage = (req, res) => {
    res.render("register.ejs");
}

module.exports.postKayitPage = (req, res) => {
    let { username, surname, mail, password } = req.body;

    res.render("register.ejs");
}