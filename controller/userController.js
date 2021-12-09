const User = require('../model/User');

module.exports.getGirisPage = (req, res) => {
    let isAuth = req.session.isAuth;
    console.log(req.baseUrl)

    if (!isAuth) {
        res.render("login.ejs", {
            isAuth
        });
    } else {
        res.redirect("/");
    }
};

module.exports.postGirisPage = (req, res) => {
    let {
        mail,
        password
    } = req.body;

    User.findOne(req.body).then((response) => {

        console.log(response)
        req.session.username = response.username;
        req.session.mail = response.mail;
        req.session.surname = response.surname;
        req.session.isAuth = true;

        req.session.save();

        res.redirect("/profil");

    }).catch((err) => {

        res.send("Bu bilgide kullanıcı bulunamadı");

    })
};

module.exports.getKayitPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.render("register.ejs", {
            isAuth
        });
    } else {
        res.redirect("/");
    }
};

module.exports.postKayitPage = (req, res) => {

    let {
        username,
        surname,
        mail,
        password
    } = req.body;

    const newUser = User({
        username,
        surname,
        mail,
        password
    });

    User.findOne({
        mail
    }).then((response) => { // maili object olarak ekle
        // response db'de bulunan tüm objeyi getiriyor
        if (response) {

            res.send(`Bu mail => (${response.mail}), zaten kullanılıyor.`);

        } else {

            newUser.save().then((response2) => {

                console.log("üye kaydı yapıldı");

            }).catch((err) => {

                console.log("kayıt yapılamadı");

                console.log(err);

            })

        }
    }).catch((err) => {

        console.log("olmadı");

        console.log(err);
    })
};

// kullanıcı paneli
module.exports.getKullaniciPage = (req, res) => {

    let isAuth = req.session.isAuth;

    let userInfoForProfile = {
        username: req.session.username,
        surname: req.session.surname,
        mail: req.session.mail
    }

    if (!isAuth) {
        res.redirect("/")
    } else {
        res.render("profile", {
            isAuth,
            userInfoForProfile
        });
    }
}

module.exports.getCikisPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {
        req.session.destroy(function (err) {
            if (!err) {

                res.render("logout", {
                    layout: "layouts/info-layout"
                })
            } else {
                console.log(err);

                res.send("session erişilemiyor");
            }
        });
    }
}