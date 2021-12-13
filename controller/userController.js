const express = require("express");

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

    let findOneForMail = req.session.mail;

    if (!isAuth) {
        res.redirect("/")
    } else {

        User.findOne({
                findOneForMail
            })
            .then((response) => {

                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
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

    let findOneForMail = req.session.mail;

    if (!isAuth) {
        res.redirect("/");
    } else {

        User.findOne({
                findOneForMail
            })
            .then((response) => {

                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                res.render("profile-edit", {
                    isAuth,
                    userInfoForProfile,
                    layout: "layouts/profile-layout"
                });
            })
    }
}

module.exports.postDuzenlePage = (req, res) => {
    let isAuth = req.session.isAuth;

    let errors = validationResult(req);

    let findOneForMail = req.session.mail;

    //User.updateOne() kısmında hata vermemesi için burada undefined olarak tanımlandı
    let alert = undefined;

    if (!errors.isEmpty()) {

        alert = errors.array();

        User.findOne({
                findOneForMail
            })
            .then((response) => {

                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                res.render("profile-edit", {
                    isAuth,
                    userInfoForProfile,
                    alert,
                    layout: "layouts/profile-layout"
                });
            })

    } else {
        console.log(req.body)
        // kullanıcı bilgilerini düzenleme sayfası için yeni bilgiler
        const {
            username,
            surname,
            mail,
            password,
            age,
            phone,
            address
        } = req.body;

        console.log(req.body)

        console.log("güncelleme alanı");

        User.findOne({
            findOneForMail
        }).then((response) => {
            console.log("güncelleme alanına girildi");

            let userInfoForProfile = {
                username: response.username,
                surname: response.surname,
                mail: response.mail,
                password: response.password,
                age: response.age,
                phone: response.phone,
                address: response.address
            };

            User.updateOne({
                    username: response.username
                }, {
                    username: username
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    surname: response.surname
                }, {
                    surname: surname
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    mail: response.mail
                }, {
                    mail: mail
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    password: response.password
                }, {
                    password: password
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    age: response.age
                }, {
                    age: age
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    phone: response.phone
                }, {
                    phone: phone
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            User.updateOne({
                    address: response.address
                }, {
                    address: address
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            res.render("profile-edit", {
                isAuth,
                userInfoForProfile,
                alert: [{
                    value: '',
                    msg: `Güncelleme başarılı!`,
                    param: 'mail',
                }],
                layout: "layouts/profile-layout"
            });
        })
    }
}

module.exports.getMyRentalCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("my-rental-cars", {
            isAuth,
            layout: "layouts/profile-layout"
        })

    }
}

module.exports.postMyRentalCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("my-rental-cars", {
            isAuth,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.getAddACarPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("add-a-car", {
            isAuth,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.postAddACarPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("add-a-car", {
            isAuth,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.getOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("own-cars", {
            isAuth,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.postOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("own-cars", {
            isAuth,
            layout: "layouts/profile-layout"
        })
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