const User = require('../model/User');

module.exports.getGirisPage = (req, res) => {
    res.render("login.ejs");
};

module.exports.postGirisPage = (req, res) => {
    let { mail, password } = req.body;

    res.send(`Giriş yaptığınız mail:${mail} <br> Şifreniz: ${password}`);
};

module.exports.getKayitPage = (req, res) => {
    res.render("register.ejs");
};

module.exports.postKayitPage = (req, res) => {
    let { username, surname, mail, password } = req.body;

    const newUser = User({
        username,
        surname,
        mail,
        password
    })

    newUser.save().then(res => console.log("üye kaydı yapıldı"))


    res.send(`Sayın ${username}, kayıt işleminiz başarılı.`);
};