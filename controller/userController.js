const express = require("express");

let {
    check,
    validationResult
} = require("express-validator");

let UserModel = require("../model/User");
let CarModel = require("../model/Cars");
let AdminModel = require("../model/adminUsers");
const {
    response
} = require("express");

module.exports.getGirisPage = (req, res) => {
    let isAuth = req.session.isAuth;

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

        if (req.body.isAdmin == "on") {

            req.body.isAdmin = true;
            req.session.isAdmin = true;

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false;

        }

        console.log(req.session.isAdmin);

        if (req.session.isAdmin) {

            AdminModel.findOne(req.body).then((response) => {

                req.session.username = response.username;
                req.session.mail = response.mail;
                req.session.surname = response.surname;
                req.session.isAuth = true;

                req.session.save();

                res.redirect("/profil");

            }).catch((err) => {

                res.send("Bu bilgide kullanıcı bulunamadı");

            })

        } else {

            UserModel.findOne(req.body).then((response) => {

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

        if (req.body.isAdmin == "on") {

            req.body.isAdmin = true;
            req.session.isAdmin = true;

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false;

        }

        if (req.body.isAdmin) {

            const newUserAdmin = AdminModel({
                username,
                surname,
                mail,
                password,
                age,
                phone,
                address
            });

            AdminModel.findOne({
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

                    newUserAdmin.save().then(() => {

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


        } else {

            const newUser = UserModel({
                username,
                surname,
                mail,
                password,
                age,
                phone,
                address
            });

            UserModel.findOne({
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

                    newUser.save().then(() => {

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
    }
};

// kullanıcı paneli
module.exports.getProfilePage = (req, res) => {
    // ekrana yazdırma hatası var

    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    let findOneForMail = req.session.mail;

    if (!isAuth) {
        res.redirect("/")
    } else {

        if (isAdmin) {

            AdminModel.findOne({
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
                        isAdmin,
                        layout: "layouts/profile-layout"
                    });


                })

        } else {

            UserModel.findOne({
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
                        isAdmin,
                        layout: "layouts/profile-layout"
                    });
                })
        }
    }
}

module.exports.getDuzenlePage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    let findOneForMail = req.session.mail;

    if (!isAuth) {
        res.redirect("/");
    } else {

        UserModel.findOne({
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
                    isAdmin,
                    layout: "layouts/profile-layout"
                });
            })
    }
}

module.exports.postDuzenlePage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    let errors = validationResult(req);

    let findOneForMail = req.session.mail;

    //UserModel.updateOne() kısmında hata vermemesi için burada undefined olarak tanımlandı
    let alert = undefined;

    if (!errors.isEmpty()) {

        alert = errors.array();

        UserModel.findOne({
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
                    isAdmin,
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

        UserModel.findOne({
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

            UserModel.updateOne({
                    username: response.username
                }, {
                    username: username
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    surname: response.surname
                }, {
                    surname: surname
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    mail: response.mail
                }, {
                    mail: mail
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    password: response.password
                }, {
                    password: password
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    age: response.age
                }, {
                    age: age
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    phone: response.phone
                }, {
                    phone: phone
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            UserModel.updateOne({
                    address: response.address
                }, {
                    address: address
                })
                .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

            res.render("profile-edit", {
                isAuth,
                isAdmin,
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
    let isAdmin = req.session.isAdmin;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("my-rental-cars", {
            isAuth,
            isAdmin,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.postMyRentalCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("my-rental-cars", {
            isAuth,
            isAdmin,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.getAddACarPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    if (!isAuth) {
        res.redirect("/");
    } else {

        res.render("add-a-car", {
            isAuth,
            isAdmin,
            layout: "layouts/profile-layout"
        })
    }
}

module.exports.postAddACarPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    let mail = req.session.mail;

    let alert = undefined;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("add-a-car", {
            isAuth,
            isAdmin,
            alert,
            layout: "layouts/profile-layout"
        })

    } else {

        let {
            carName,
            carModel,
            carBodyType,
            carEngineCapacity,
            fuelConsumption,
            abs,
            airBag,
            carbonEmission,
            seats,
            carTrunk,
            doors,
            gear,
            fuelType,
            cruiseControl,
            yearOfProduction,
            deposit,
            hourlyRate
        } = req.body;

        const newCar = CarModel({
            carName,
            carModel,
            carBodyType,
            carEngineCapacity,
            fuelConsumption,
            abs,
            airBag,
            carbonEmission,
            seats,
            carTrunk,
            doors,
            gear,
            fuelType,
            cruiseControl,
            yearOfProduction,
            deposit,
            hourlyRate
        });

        AdminModel.findOne({
                mail
            })
            .then((response) => {

                newCar.ownerAdmin.ownerName = response.username;
                newCar.ownerAdmin.ownerSurname = response.surname;
                newCar.ownerAdmin.ownerMail = response.mail;
                newCar.ownerAdmin.ownerPhone = response.phone;
                newCar.ownerAdmin.ownerAddress = response.address;

                response.ownCars.push(newCar);

                newCar.save();
                response.save();

                res.json(response);

                /* res.render("add-a-car", {
                    isAuth,
                    isAdmin,
                    layout: "layouts/profile-layout"
                }) */
            }).catch((err) => {
                console.log(err);
            })
    }
}

module.exports.getOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    let mail = req.session.mail;

    if (!isAuth) {
        res.redirect("/");
    } else {

        AdminModel.findOne({
                mail
            })
            .then((response) => {
                let arrayOfCars = response.ownCars;

                res.render("own-cars", {
                    isAuth,
                    isAdmin,
                    arrayOfCars,
                    layout: "layouts/profile-layout"
                })
            })
    }
}

module.exports.postOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let mail = req.session.mail;

    let deleteCar = req.body.carIdForDelete;
    let goRentCar = req.body.carIdForRent;

    if (!isAuth) {
        res.redirect("/");
    } else {

        if (deleteCar) {

            CarModel.findByIdAndRemove(deleteCar)
                .then((response) => {
                    console.log("id:" + response + " silindi");
                })
                .catch((err) => {
                    console.log(err);
                    console.log("silinemedi")
                })

            AdminModel.findOne({
                    mail
                })
                .then((response2) => {

                    for (let i = 0; i < response2.ownCars.length; i++) {
                        let getIDFromDoc = response2.ownCars[i]._id.toString();

                        if (getIDFromDoc.includes(deleteCar)) {
                            console.log("seçildi");

                            response2.ownCars.splice(i, 1);
                        }
                    }

                    response2.save();
                })

        } else if (goRentCar) {


        }

        res.redirect("/profil/araclarim");
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