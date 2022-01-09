// Moduller
const express = require("express");

let {
    check,
    validationResult
} = require("express-validator");

let UserModel = require("../model/User");
let CarModel = require("../model/Cars");
let AdminModel = require("../model/adminUsers");
let CountryModel = require("../model/Country");

const {
    response
} = require("express");
const {
    json
} = require("body-parser");
// Moduller

//Kullanıcı giriş ve kayıt işlemlerinin yapıldığı yer
module.exports.getGirisPage = (req, res) => {
    let isAuth = req.session.isAuth;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("login", {
            isAuth,
            alert
        });
        // errors değikeni boş değil ise buraya bir json dosyası gönderilir ve onlar ekrana yazılır
    } else {

        // req.body'den gelen isAdmin propertysi on ise admin girişi yapılır
        // değilse normal üyelik girişi yapılır
        if (req.body.isAdmin == "on") {

            req.body.isAdmin = true;
            req.session.isAdmin = true;

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false;

        }
        console.log("admin kontrolü: " + req.session.isAdmin)
        let findOneForMail = req.body.mail;

        // Admin girişi yapıldıysa, admin için ayrılan veritabanına AdminModel modeline bilgiler eklenir
        if (req.session.isAdmin) {

            AdminModel.findOne({
                mail: findOneForMail
            }).then((response) => {

                req.session.username = response.username;
                req.session.mail = response.mail;
                req.session.surname = response.surname;
                req.session.isAuth = true;

                res.redirect("/profil");

            }).catch((err) => {

                res.send("Bu bilgide kullanıcı bulunamadı");

            })

        } else {

            // req.body.isAdmin = undefined ise kullanıcı girişi yapılır
            UserModel.findOne({
                mail: findOneForMail
            }).then((response) => {

                console.log(response)
                req.session.username = response.username;
                req.session.mail = response.mail;
                req.session.surname = response.surname;
                req.session.isAuth = true;

                res.redirect("/profil");

            }).catch((err) => {

                res.send("Bu bilgide kullanıcı bulunamadı");

            })
        }
    }
};

module.exports.getKayitPage = (req, res) => {
    let isAuth = req.session.isAuth;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("register", {
            isAuth,
            alert
        });
        // errors değikeni boş değil ise buraya bir json dosyası gönderilir ve onlar ekrana yazılır

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
        // req.body den gelen propertyler değişkenlere atanır

        // req.body'den gelen isAdmin propertysi on ise admin üyeliği yapılır
        // değilse normal üyelik girişi yapılır
        if (req.body.isAdmin == "on") {

            req.body.isAdmin = true;
            req.session.isAdmin = true;

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false;

        }

        //isAdmin = true ise Yeni admin üyeliği yapılır ve bu veriler veri tabanına eklenir
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
            }).then((response) => {
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

            //isAdmin = false ise kullanıcı üyeliği yapılır

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
            }).then((response) => {
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
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    let findOneForMail = req.session.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    if (!isAuth) {
        res.redirect("/")
    } else {
        // Kullanıcı giriş yaptığında isAdmin = true ise admin girişi yapar
        if (isAdmin) {

            AdminModel.findOne({
                    mail: findOneForMail
                })
                .then((response) => {

                    let userInfoForProfile = {
                        username: response.username,
                        surname: response.surname,
                        mail: req.session.mail,
                        age: response.age,
                        phone: response.phone,
                        address: response.address,
                    }

                    res.render("profile", {
                        layout: "layouts/profile-layout",
                        isAuth,
                        userInfoForProfile,
                        isAdmin
                    });
                })

        } else {
            // Kullanıcı giriş yaptığında isAdmin = false ise müşteri girişi yapar

            UserModel.findOne({
                    findOneForMail
                })
                .then((response) => {

                    // Profil kısmında kullanıcıların bilgilerini görebilmesi için session'a eklenen bilgileri ekrana yazdırılması için bir objeye atanır
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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    if (!isAuth) {
        res.redirect("/");
    } else {

        // Burada kullanıcının admin girişi yapıp yapmadığını kontrol ediyor
        if (isAdmin) {

            AdminModel.findOne({
                    mail: findOneForMail
                })
                .then((response) => {

                    //Düzenleme sayfasında kullanıcının veri tabanında bulunan verilerini görebilmesi için kullanıcı bilgilerini bir objeye atanıyor
                    // daha sonra res.render() a gönderilir ve ekrana yazdırılır

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

        } else {

            //isAdmin = false ise bu alana giriş yapılır
            // Müşteri girişi olduğu için müşterinin veritabanındaki verilerini ekrana yazdırmak için gerekli bilgileri çeker

            UserModel.findOne({
                    mail: findOneForMail
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
}

module.exports.postDuzenlePage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    let findOneForMail = req.session.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    let errors = validationResult(req);

    //UserModel.updateOne() kısmında hata vermemesi için burada undefined olarak tanımlandı
    let alert = undefined;

    if (!errors.isEmpty()) {

        alert = errors.array();

        if (isAdmin) {

            AdminModel.findOne({
                mail: findOneForMail
            }).then((response) => {

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

            });

        } else {

            UserModel.findOne({
                mail: findOneForMail
            }).then((response) => {

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
            });
        }

    } else {
        console.log(req.body)
        // kullanıcı bilgilerini düzenleme sayfası için yeni bilgiler

        if (isAdmin) {

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

            //güncellenecek olan verilerin hangi objede olduğu çağrılıyor
            AdminModel.findOne({
                mail: findOneForMail
            }).then((response) => {
                console.log("güncelleme alanına girildi");

                //Eski ve yeni veriler karşılaştırılıp yer değiştireceği için önce veritabanındaki var olan veriler objeye atanıyor
                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                // Verilerin güncellendiği yer
                AdminModel.updateOne({
                        username: response.username
                    }, {
                        username: username
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
                        surname: response.surname
                    }, {
                        surname: surname
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
                        mail: response.mail
                    }, {
                        mail: mail
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
                        password: response.password
                    }, {
                        password: password
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
                        age: response.age
                    }, {
                        age: age
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
                        phone: response.phone
                    }, {
                        phone: phone
                    })
                    .then(() => console.log("Success!")).catch((errorUpdate) => console.log(errorUpdate));

                AdminModel.updateOne({
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

        } else {
            // admin bilgilerini düzenleme sayfası için yeni bilgiler

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

            //güncellenecek olan verilerin hangi objede olduğu çağrılıyor
            UserModel.findOne({
                mail: findOneForMail
            }).then((response) => {
                console.log("güncelleme alanına girildi");

                //Eski ve yeni veriler karşılaştırılıp yer değiştireceği için önce veritabanındaki var olan veriler objeye atanıyor
                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                // Verilerin güncellendiği yer
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
}

module.exports.getMyRentalCarsPage = (req, res) => {
    //Aracı yalnızca kullanıcılar kiralayabildiği için bu sayfa UserModel Modeline özeldir

    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    let findOneForMail = req.session.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    if (!isAuth) {
        res.redirect("/");
    } else {

        UserModel.findOne({
                mail: findOneForMail
            })
            .then((response) => {
                let arrayOfCars = response.rentedCar;

                res.render("my-rental-cars", {
                    isAuth,
                    isAdmin,
                    arrayOfCars,
                    layout: "layouts/profile-layout"
                })
            })
    }
}

module.exports.postMyRentalCarsPage = (req, res) => {
    let mail = req.session.mail;
    let isAuth = req.session.isAuth;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    if (!isAuth) {
        res.redirect("/");
    } else {

        //Kullanıcıdan silincek olan aracın obje id'si
        let carIdForRemoveFromUser = req.body.carIdForRemoveFromUser;

        UserModel.findOne({
                mail: mail
            }).then((response) => {

                //Kullanıcının kiraladığı aracı silme işlemi
                for (let i = 0; i < response.rentedCar.length; i++) {

                    let removeCar = response.rentedCar[i]._id.toString();

                    console.log(carIdForRemoveFromUser.includes(removeCar))

                    if (carIdForRemoveFromUser.includes(removeCar)) {
                        console.log("userdan bir obje silindi");

                        response.rentedCar.splice(i, 1);

                        response.save();

                        // Silinen araç CarModel modelinde kiralanma durumu false yapılır
                        CarModel.findOneAndUpdate({
                            "_id": removeCar
                        }, {
                            "isRented": false,
                            "isListed": false
                        }).then(() => {})

                        res.redirect("/profil/kiralanan-araclar");
                    }
                }
            })
            .catch(err => console.log(err))
    }
}

module.exports.getAddACarPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    let errors = validationResult(req);

    if (!errors.isEmpty()) {

        let alert = errors.array();

        res.render("add-a-car", {
            isAuth,
            isAdmin,
            alert,
            layout: "layouts/profile-layout"
        })
        // errors değikeni boş değil ise buraya bir json dosyası gönderilir ve onlar ekrana yazılır

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
            hourlyRate,
            carProvince,
            carDistrict,
        } = req.body;
        // Veritabanına eklenecek olan aracın verileri req.body'den çekiliyor

        // İlk olarak veritabanına eklenen araç kiralık veya listeli olmadığı için
        //isListed ve isRented değerleri false olarak atanır
        let isListed = false; //Listelenme durumu
        let isRented = false; // kiralanma durumu
        let image = req.file.filename; // aracın fotoğrafının dosya yolu

        //CarModeli modeli değişkene aktarılıyor
        let newCar = CarModel({
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
            hourlyRate,
            carProvince,
            carDistrict,
            isRented,
            isListed,
            image
        });

        // Burası, aracı ekleyen adminin ownCars kısmına eklemek için
        AdminModel.findOne({
                mail
            })
            .then((response) => {


                // Aracın sahibinin gözükmesi için responsetan gelen admin verileri newCar objesine ekleniyor
                newCar.ownerAdmin.ownerName = response.username;
                newCar.ownerAdmin.ownerSurname = response.surname;
                newCar.ownerAdmin.ownerMail = response.mail;
                newCar.ownerAdmin.ownerPhone = response.phone;
                newCar.ownerAdmin.ownerAddress = response.address;

                response.ownCars.push(newCar); // Adminin ownCars kısmına pushlanıyor

                newCar.save(); // araç kaydediliyor
                response.save(); // Adminin ownCars kısmına pushlanan newCar objesi kaydediliyor

                res.redirect("/profil/araclarim");

            }).catch((err) => {
                console.log(err);
            })
    }
}

module.exports.getOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    let findOneForMail = req.session.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    if (!isAuth) {
        res.redirect("/");
    } else {

        let alert = undefined;

        let errors = validationResult(req);

        if (!errors.isEmpty()) {

            let alert = errors.array();

            res.render("own-cars", {
                isAuth,
                isAdmin,
                alert,
                layout: "layouts/profile-layout"
            })
            // errors değikeni boş değil ise buraya bir json dosyası gönderilir ve onlar ekrana yazılır

        } else {

            // Adminin sahip olduğu araçları (varsa) ekranda göstermesini sağlar
            AdminModel.findOne({
                    mail: findOneForMail
                })
                .then((response) => {
                    let arrayOfCars = response.ownCars;

                    res.render("own-cars", {
                        isAuth,
                        isAdmin,
                        arrayOfCars,
                        alert,
                        layout: "layouts/profile-layout"
                    })
                })
        }
    }
}

module.exports.postOwnCarsPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let mail = req.session.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    let deleteCar = req.body.carIdForDelete; // silinmek istenen aracın id'si
    let goRentCar = req.body.carIdForRent; // Kiralanmak istenen aracın id'si
    let removeRenting = req.body.carIdForRemoveRenting; // Kiralıktan kaldırılmak istenen aracın id'si
    // Adminin araca yapmak istediği işlemleri bir değişkene aktarılır

    if (!isAuth) {
        res.redirect("/");
    } else {

        // Seçilen aracın silindiği alan
        if (deleteCar) {

            console.log("deletecar alanı: " + deleteCar)

            CarModel.findByIdAndRemove(deleteCar)
                .then((response) => {

                    console.log("id: silindi");
                })
                .catch((err) => {
                    console.log(err);
                    console.log("silinemedi");
                })

            AdminModel.findOne({
                    mail: mail
                })
                .then((response) => {

                    for (let i = 0; i < response.ownCars.length; i++) {
                        let getIDFromDoc = response.ownCars[i]._id.toString();

                        if (getIDFromDoc.includes(deleteCar)) {
                            console.log("seçildi");

                            response.ownCars.splice(i, 1);

                            response.save();

                            res.redirect("/profil/araclarim");
                        }
                    }
                })
            //Seçilen aracın kiralanma alanı
        } else if (goRentCar) {

            console.log("gorentcar alanı: " + goRentCar);

            AdminModel.findOne({
                    mail: mail
                })
                .then((response) => {

                    for (let i = 0; i < response.ownCars.length; i++) {

                        let getIDFromDoc = response.ownCars[i]._id.toString();
                        let getPersonIDFromDoc = response._id.toString();
                        let getObjectOfCar = response.ownCars[i];

                        if (getIDFromDoc.includes(goRentCar)) {

                            let provinceOfCar = response.ownCars[i].carProvince;
                            let districtOfCar = response.ownCars[i].carDistrict;

                            CountryModel.find()
                                .then((response2) => {

                                    let country = response2[0].turkey;

                                    for (let z = 0; z < country.length; z++) {

                                        if (country[z].il == provinceOfCar) {

                                            console.log("önce bu mu")

                                            for (let j = 0; j < country[z].ilceler.length; j++) {

                                                if (country[z].ilceler[j][0] == districtOfCar) {
                                                    console.log("seçilen ilçe: " + country[z].ilceler[j][0]);
                                                    console.log("seçilen il: " + country[z].il);

                                                    // güncelleme alanı
                                                    AdminModel.findOneAndUpdate({
                                                            mail: mail,
                                                        }, {
                                                            [`ownCars.${i}.isListed`]: true
                                                        }, {
                                                            new: true
                                                        })
                                                        .then(() => {});

                                                    CarModel.findOneAndUpdate({
                                                            _id: goRentCar
                                                        }, {
                                                            "isListed": true
                                                        })
                                                        .then(() => {})

                                                    CountryModel.findOneAndUpdate({}, {
                                                            $push: {
                                                                [`turkey.${z}.ilceler.${j}.${1}`]: getObjectOfCar
                                                            }
                                                        })
                                                        .then(() => {
                                                            console.log("Araba objesi pushlandı");
                                                        });
                                                }
                                            }
                                        }
                                    }
                                    res.redirect("/profil/araclarim");
                                })
                        }
                    }
                })
            // Seçilen aracın kiralıktan kaldırılma işlemi
        } else if (removeRenting) {

            console.log("araş kaldırma id = ")
            console.log(removeRenting)

            AdminModel.findOne({
                    mail: mail
                })
                .then((response) => {

                    for (let i = 0; i < response.ownCars.length; i++) {

                        let getIDFromDoc = response.ownCars[i]._id;
                        let getIDFromDocString = response.ownCars[i]._id.toString();


                        if (getIDFromDocString.includes(removeRenting)) {

                            let provinceOfCar = response.ownCars[i].carProvince;
                            let districtOfCar = response.ownCars[i].carDistrict;

                            CountryModel.find()
                                .then((response2) => {

                                    let country = response2[0].turkey;

                                    for (let z = 0; z < country.length; z++) {

                                        if (country[z].il == provinceOfCar) {

                                            for (let j = 0; j < country[z].ilceler.length; j++) {

                                                if (country[z].ilceler[j][0] == districtOfCar) {
                                                    console.log("seçilen ilçe: " + country[z].ilceler[j][0]);
                                                    console.log("seçilen il: " + country[z].il);

                                                    CountryModel.findOneAndUpdate({}, {
                                                            $pull: {
                                                                [`turkey.${z}.ilceler.${j}.${1}`]: {
                                                                    _id: getIDFromDoc
                                                                }
                                                            }
                                                        })
                                                        .then(() => {
                                                            console.log("Araba objesi silindi");
                                                        });

                                                    CarModel.findOneAndUpdate({
                                                            _id: removeRenting
                                                        }, {
                                                            "isListed": false
                                                        })
                                                        .then(() => {})

                                                    AdminModel.findOneAndUpdate({
                                                            mail: mail
                                                        }, {
                                                            [`ownCars.${i}.isListed`]: false
                                                        }, {
                                                            new: true
                                                        })
                                                        .then(() => {
                                                            console.log("Araç kiralamadan kaldırıldı")
                                                        });
                                                }
                                            }
                                        }
                                    }
                                    res.redirect("/profil/araclarim");
                                })
                        }
                    }
                })
        }
    }
}

module.exports.postCarListPage = (req, res) => {
    let findOneForMail = req.session.mail;
    let rentCarId = req.body.rentCar;

    CarModel.findOne({
            _id: rentCarId
        })
        .then((response) => {

            UserModel.findOneAndUpdate({
                mail: findOneForMail
            }, {
                $push: {
                    "rentedCar": response
                }
            }).then(() => {
                console.log("başarılı")
            }).catch((err) => {
                console.log(err)
            })
        })

    CarModel.findByIdAndUpdate({
        _id: rentCarId
    }, {
        "isRented": true,
        "isListed": false
    }).then(() => {
        console.log("car model isrented true")
    })

    res.redirect("/arac-secimi");

}

module.exports.getCarListPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;

    if (!isAuth) {

        res.redirect("/");

    } else {

        let totalPaidDays = 0;

        let selectedProvince = req.session.il;
        let selectedDistrict = req.session.ilce;

        let selectedProvinceAndDistrict = {
            province: selectedProvince,
            district: selectedDistrict
        }

        let purchaseDay = req.session.purchaseDay;
        let purchaseMonth = req.session.purchaseMonth;

        let deliveryDay = req.session.deliveryDay;
        let deliveryMonth = req.session.deliveryMonth;

        if (deliveryMonth > purchaseMonth) {
            console.log("teslim tarihi alış tarihinden büyük");

            let differencBetweenMonths = (deliveryMonth - purchaseMonth) - 2;

            if (differencBetweenMonths == -1) {
                differencBetweenMonths = 0;
            }

            console.log("aylar arasi fark: " + differencBetweenMonths);

            let paidDaysOfFirstMonth = 31 - purchaseDay;

            console.log("İlk ay: " + paidDaysOfFirstMonth);

            let paidDaysOfLastMonth = 31 - deliveryDay;

            console.log("Son ay: " + paidDaysOfLastMonth);

            let differenceBetweenFromFirstToLastMonths = paidDaysOfLastMonth + paidDaysOfFirstMonth;

            console.log("ilk ve son ay toplamı: " + differenceBetweenFromFirstToLastMonths);

            totalPaidDays = (differencBetweenMonths * 31) + differenceBetweenFromFirstToLastMonths;

            console.log("toplam ücretli gün: " + totalPaidDays)


        } else if (deliveryMonth == purchaseMonth) {

            console.log("ayların ikisi aynı");

            totalPaidDays = deliveryDay - purchaseDay;

            console.log("toplam ücretli gün: " + totalPaidDays);

        } else if (deliveryMonth < purchaseMonth) {

            console.log("alış tarihi, teslim tarihinden büyük olamaz!")

        }

        CountryModel.find({})
            .then((response) => {

                let country = response[0].turkey;

                for (let i = 0; i < country.length; i++) {

                    if (selectedProvince == country[i].il) {
                        console.log("seçilen il: " + country[i].il)

                        for (let j = 0; j < country[i].ilceler.length; j++) {
                            if (selectedDistrict == country[i].ilceler[j][0]) {

                                console.log("Seçilen İlçe: " + country[i].ilceler[j][0])

                                let arrayOfCars = country[i].ilceler[j][1];

                                res.render(`car-list`, {
                                    layout: "layouts/car-select-layout",
                                    isAuth,
                                    isAdmin,
                                    selectedProvinceAndDistrict,
                                    arrayOfCars,
                                    totalPaidDays
                                });
                            }
                        }
                    }
                }
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