const {
    response
} = require("express");
let {
    check,
    validationResult
} = require("express-validator");

let User = require("../model/User");

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
    let isAuth = req.session.isAuth;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("login", {
            isAuth,
            alert
        });

    } else {

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

    }
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
    let isAuth = req.session.isAuth;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("register", {
            isAuth,
            alert
        });

    } else {
        let {
            username,
            surname,
            mail,
            password,
            age,
            phone,
            address
        } = req.body;

        const newUser = User({
            username,
            surname,
            mail,
            password,
            age,
            phone,
            address
        });

        User.findOne({
            mail
        }).then((response) => { // maili object olarak ekle
            // response db'de bulunan tüm objeyi getiriyor
            if (response) {

                res.render("register", {
                    isAuth,
                    alert: [{
                        value: '',
                        msg: `Bu mail (${response.mail}) adresi zaten kullanılıyor!`,
                        param: 'mail',
                    }]
                });

            } else {

                newUser.save().then((response2) => {

                    console.log("üye kaydı yapıldı");

                    res.redirect("/giris");

                }).catch((err) => {

                    console.log("kayıt yapılamadı");

                    console.log(err);

                })

            }
        }).catch((err) => {

            console.log("olmadı");

            console.log(err);
        })
    }

};

// kullanıcı paneli
module.exports.getProfilePage = (req, res) => {

    let isAuth = req.session.isAuth;

    let mailForFindOne = req.session.mail;

    if (!isAuth) {
        res.redirect("/")
    } else {

        User.findOne({
                mailForFindOne
            })
            .then((response) => {

                let userInfoForProfile = {
                    username: req.session.username,
                    surname: req.session.surname,
                    mail: req.session.mail,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                }

                res.render("profile", {
                    isAuth,
                    userInfoForProfile,
                    layout: "layouts/profile-layout"
                });

            })
    }
}

module.exports.getDuzenlePage = (req, res) => {
    let isAuth = req.session.isAuth;

    let mailForFindOne = req.session.mail;

    if (!isAuth) {
        res.redirect("/")
    } else {

        User.findOne({
                mailForFindOne
            })
            .then((response) => {

                let userInfoForProfile = {
                    username: req.session.username,
                    surname: req.session.surname,
                    mail: req.session.mail,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                }

                res.render("profile-edit", {
                    isAuth,
                    userInfoForProfile,
                    layout: "layouts/profile-layout"
                });

            })
    }
}

module.exports.postDuzenlePage = (req, res) => {

    

     res.send("düzenleme sayfası");
}

module.exports.getMyRentalCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;

    res.render("profile-my-rental-cars", {
        isAuth,
        layout: "layouts/profile-layout"
    })
}

module.exports.postMyRentalCarsPage = (req, res) => {

    /* res.send("rental cars sayfası") */
}

module.exports.getCikisPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {
        req.session.destroy(function (err) {
            if (!err) {

                res.render("logout", {
                    infoMessage: "Çıkış başarılı!",
                    layout: "layouts/info-layout"
                })
            } else {
                console.log(err);

                res.send("session erişilemiyor");
            }
        });
    }
}