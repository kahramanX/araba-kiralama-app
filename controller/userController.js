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

    User.findOne({mail}).then((mail) => {

        if (mail){
            console.log("Giriş yapamazsın");
            res.send(`Bu mail => (${mail.mail}), zaten kullanılıyor.`);
        } else {
            console.log("Giriş yapabilirsin");

            newUser.save().then((res) => {
                console.log("üye kaydı yapıldı");
                res.send(`Bu mail => (${res.mail}) ile giriş yapıldı`);
                
            }).catch((res) => {
                console.log(res)
                console.log("kayıt yapılamadı");
            })


        }
    })
};