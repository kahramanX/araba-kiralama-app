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
const { findOne } = require("../model/User");
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
    let findOneForMail = req.body.mail;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    // form verileri istenildiği gibi çalışmazsa validationResult() moduülü çalışır
    let errors = validationResult(req);

    // form verileri boş değilse alttaki koşulu atlar
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
            req.session.isAdmin = true; // daha sonra kullanılacağı için session store'a aktarılır

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false; // daha sonra kullanılacağı için session store'a aktarılır

        }
        console.log("admin kontrolü: " + req.session.isAdmin)

        // Admin girişi yapıldıysa, admin için ayrılan veritabanına AdminModel modeline bilgiler eklenir
        if (req.session.isAdmin) {

            AdminModel.findOne({
                mail: findOneForMail
            }).then((response) => {

                // Şartlar sağlandığında findOne() ile bulunan objenin bilgileri session'a atanıyor
                req.session.username = response.username;
                req.session.mail = response.mail;
                req.session.surname = response.surname;
                req.session.isAuth = true;

                res.redirect("/profil"); //  profil sayfasına yönlendiriliyor

            }).catch((err) => {

                res.send("Bu bilgide kullanıcı bulunamadı");

            })

        } else {

            // req.body.isAdmin = undefined ise kullanıcı girişi yapılır
            UserModel.findOne({
                mail: findOneForMail
            }).then((response) => {

                // Şartlar sağlandığında findOne() ile bulunan objenin bilgileri session'a atanıyor
                req.session.username = response.username;
                req.session.mail = response.mail;
                req.session.surname = response.surname;
                req.session.isAuth = true;

                res.redirect("/profil"); //  profil sayfasına yönlendiriliyor

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
            req.session.isAdmin = true; // daha sonra kullanım için session'a aktarılıyor

        } else if (req.body.isAdmin == undefined) {

            req.body.isAdmin = false;
            req.session.isAdmin = false; // daha sonra kullanım için session'a aktarılıyor

        }

        //isAdmin = true ise Yeni admin üyeliği yapılır ve bu veriler veri tabanına eklenir
        if (req.body.isAdmin) {

            // Veri tabaına eklemek için önceden hazırlanan model newUserAdmin değişkenine atanıyor
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

                    //sayfa render işlemleri
                    res.render("register", {
                        isAuth,
                        alert: [{
                            value: '',
                            msg: `Bu mail (${response.mail}) adresi zaten kullanılıyor!`,
                            param: 'mail',
                        }]
                    });

                } else {

                    //admin bilgileri kaydediliyor
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

            //isAdmin = false ise müşteri üyeliği yapılır

            // Veri tabaına eklemek için önceden hazırlanan model newUserAdmin değişkenine atanıyor
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

                    //sayfa render işlemleri
                    res.render("register", {
                        isAuth,
                        alert: [{
                            value: '',
                            msg: `Bu mail (${response.mail}) adresi zaten kullanılıyor!`,
                            param: 'mail',
                        }]
                    });

                } else {

                    //kullanıcı kaydediliyor
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
    console.log(findOneForMail);
    console.log(isAuth)
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

                    // res.render()'a gönderilecek olan kullanıcı bilgileri
                    let userInfoForProfile = {
                        username: response.username,
                        surname: response.surname,
                        mail: req.session.mail,
                        age: response.age,
                        phone: response.phone,
                        address: response.address,
                    }

                    // sayfa render işlemleri
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
                    mail: findOneForMail
                })
                .then((response) => {

                    // res.render()'a gönderilecek olan kullanıcı bilgileri
                    let userInfoForProfile = {
                        username: response.username,
                        surname: response.surname,
                        mail: response.mail,
                        age: response.age,
                        phone: response.phone,
                        address: response.address
                    }

                    // sayfa render işlemleri
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

    //kullanıcının giriş yapıp yapmadığını kontol eder
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

        // Kullanıcı giriş yaptığında isAdmin = true ise admin girişi yapar
        if (isAdmin) {

            AdminModel.findOne({
                mail: findOneForMail
            }).then((response) => {

                // ekrana yazdırılması gereken kullanıcı bilgileri objeye atanıyor
                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                // sayfa render işlemleri
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

                // ekrana yazdırılması gereken kullanıcı bilgileri objeye atanıyor
                let userInfoForProfile = {
                    username: response.username,
                    surname: response.surname,
                    mail: response.mail,
                    password: response.password,
                    age: response.age,
                    phone: response.phone,
                    address: response.address
                };

                // sayfa render işlemleri
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
        // errors kısmı boş ise buraya girilir
        console.log(req.body)
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
            // kullanıcı bilgilerini düzenleme sayfası için yeni bilgiler

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


                //sayfa renderlama işlemleri
                res.render("profile-edit", {
                    isAuth,
                    isAdmin,
                    userInfoForProfile,
                    alert: [{
                        value: '',
                        msg: `Güncelleme başarılı!`, // işlem başarılı olduğunda hata yerine, bilgi verme amaçlı
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
            // yeni bilgiler değişkenlere atanıyor

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

                //sayfa renderlama işlemleri
                res.render("profile-edit", {
                    isAuth,
                    isAdmin,
                    userInfoForProfile,
                    alert: [{
                        value: '',
                        msg: `Güncelleme başarılı!`, // hata değil, bilgi verme amaçlı
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

                    if (carIdForRemoveFromUser.includes(removeCar)) { // seçilen aracın id'si silinmek istenene araçla eşitse bu şart çalışır
                        console.log("userdan bir obje silindi");

                        response.rentedCar.splice(i, 1); // seçilen aracın indexi rentedCar kısmından silinir

                        response.save(); // silindikten sonra kullanıcı bilgileri kaydediliyor

                        // Silinen araç CarModel modelinde kiralanma durumu false yapılır
                        CarModel.findOneAndUpdate({
                            "_id": removeCar
                        }, {
                            "isRented": false, // aracın kiralanma durumu false yapılıyor
                            "isListed": false // aracın listelenme durumu false yapılıyor
                        }).then(() => {})

                        res.redirect("/profil/kiralanan-araclar"); // kiralanan araçlar sayfasına yönlendiriliyor
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

            CarModel.findByIdAndRemove(deleteCar) // silinmek istenen aracın id'si taranıyor
                .then((response) => {

                    console.log("id: silindi");
                })
                .catch((err) => {
                    console.log(err);
                    console.log("silinemedi");
                })

            AdminModel.findOne({ // silinmek istenen araç, adminin ownCars kısmında bulunan indeksten silinmesi işlemi
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
            // Seçilen mail adresine göre admin veri tabanında taratılıyor
            AdminModel.findOne({
                    mail: mail
                })
                .then((response) => {

                    for (let i = 0; i < response.ownCars.length; i++) {

                        let getIDFromDoc = response.ownCars[i]._id.toString(); // adminin sahip olduğu aracın id'si değişkene atanıyor
                        let getPersonIDFromDoc = response._id.toString(); // adminin id'si değişkene atanıyor
                        let getObjectOfCar = response.ownCars[i]; // kiralamak istediği aracın objesi

                        if (getIDFromDoc.includes(goRentCar)) { // adminin sahip olduğu araçların id'si, seçilen aracın id'si ile eşleşiyorsa bu blok çalışıyor

                            let provinceOfCar = response.ownCars[i].carProvince; // Seçilen aracın ili
                            let districtOfCar = response.ownCars[i].carDistrict; // Seçilen aracın ilçesi

                            // Seçilen araç, seçilen il ve ilçeye gönderilmesi için Türkiye il ve ilçeleri veri tabanından getiliyor
                            CountryModel.find()
                                .then((response2) => {

                                    let country = response2[0].turkey;

                                    for (let z = 0; z < country.length; z++) {

                                        if (country[z].il == provinceOfCar) { // seçilen il ve veritabanındaki il eşitse şart bloğu çalışır

                                            for (let j = 0; j < country[z].ilceler.length; j++) {

                                                if (country[z].ilceler[j][0] == districtOfCar) {
                                                    console.log("seçilen ilçe: " + country[z].ilceler[j][0]);
                                                    console.log("seçilen il: " + country[z].il);

                                                    // güncelleme alanı
                                                    // seçilen aracın listelenme durumu true yapılıyor
                                                    AdminModel.findOneAndUpdate({
                                                            mail: mail,
                                                        }, {
                                                            [`ownCars.${i}.isListed`]: true // adminin ownCars kısmında bulunan ve seçilen aracın listelenme durumu true yapılıyor

                                                        }, {
                                                            new: true
                                                        })
                                                        .then(() => {});

                                                    CarModel.findOneAndUpdate({
                                                            _id: goRentCar
                                                        }, {
                                                            "isListed": true  // seçilen araç, CarModel kısmında bulunuyor ve listelenme durumu true yapılıyor
                                                        })
                                                        .then(() => {})

                                                        // Türkiye il ve ilçeleri veritabanına seçilen araç objesi push ediliyor
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
                                    // işlemler bitttikten sonra araçlarım sayfasına yönlendiriliyor 
                                    res.redirect("/profil/araclarim");
                                })
                        }
                    }
                })
        } else if (removeRenting) { 
            // Seçilen aracın kiralıktan kaldırılma işlemi seçildiyse bu blok çalışır

            console.log("araş kaldırma id = ")
            console.log(removeRenting)

            AdminModel.findOne({
                    mail: mail 
                })
                .then((response) => {

                    for (let i = 0; i < response.ownCars.length; i++) {

                        let getIDFromDoc = response.ownCars[i]._id;
                        let getIDFromDocString = response.ownCars[i]._id.toString();


                        if (getIDFromDocString.includes(removeRenting)) { // adminin ownCars kısmında bulunan araçlar, seçilen araç id si ile eşleşirse şart bloğu çalışır

                            let provinceOfCar = response.ownCars[i].carProvince; 
                            let districtOfCar = response.ownCars[i].carDistrict;
                            // aracın il ve ilçeleri değişkenlere atanıyor

                            // Ülke veri tabanı getiriliyor ve seçilen aracın id'si ile eşleşirse bulunduğu il ve ilçeden kaldırılma işlemi
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
                                                            $pull: { // seçilen aracın id'si eşleştiğinde ülke veritabanından araç kaldırılır
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
                                                            "isListed": false // seçilen aracın id'si eşleştiğinde listelenme durumu false yapılıyor
                                                        })
                                                        .then(() => {})

                                                    AdminModel.findOneAndUpdate({
                                                            mail: mail
                                                        }, {
                                                            [`ownCars.${i}.isListed`]: false // adminin ownCars kısmında bulunan aracın listelenme durumu false yapılıyor
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
                                    // işlemler bittikten sonra araçlarım sayfasına yönlendirlir
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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    // seçilen aracın id'si ile CarModel da araçlar taranıyor
    CarModel.findOne({
            _id: rentCarId
        })
        .then((response) => {

            // Seçilen araç bulundu ve aracı kiralayan müşteriye ekleniyor
            // findOneForMail değişkeni, giriş yapan kullanıcının mailini sessiondan alır ve bu mail adresine göre kullanıcılar arasında tarama yapar
            UserModel.findOneAndUpdate({
                mail: findOneForMail
            }, {
                $push: {
                    "rentedCar": response // rentedCar kısmına araç(response) push ediliyor
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
        "isRented": true, // kiralanma durumu true yapılıyor (yani artık kiralandığı anlaşılıyor)
        "isListed": false // listelenme durumu false oalrak kalıyor
    }).then(() => {
        console.log("car model isrented true")
    })

    // araç seçimi sayfasında tekrar yönlendirme yapılıyor
    res.redirect("/arac-secimi");

}

module.exports.getCarListPage = (req, res) => {
    let isAuth = req.session.isAuth;
    let isAdmin = req.session.isAdmin;
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    // kullanıcnın giriş yapıp yapmadığı kontrol ediyor
    // kullanıcı giriş yapmadan listeli araçları göremez
    if (!isAuth) {

        res.redirect("/");

    } else {

        // il, ilçe ve tarih seçim kısmındaki tarihin hesaplanması
        // Bu blokta, aracın toplam ücretli günleri hesaplanmaktadır.
        // Aracın toplam ücretli günleri bulunduktan sonra session'a aktarılır.
        //Böylece "toplam ücretli gün x Aracın günlük fiyatı = fiyat" ortaya çıkar
        // araçların fiyatı günlük olarak hesaplanmaktadır
        let totalPaidDays = 0;

        // sessiona aktarılan il ve ilçe değişkenlere atanıyor
        let selectedProvince = req.session.il;
        let selectedDistrict = req.session.ilce;

        // res.render() kısmında kullanılmak üzere bir objeye atanıyor
        let selectedProvinceAndDistrict = {
            province: selectedProvince,
            district: selectedDistrict
        }

        // seçilen ay ve günler değişkenlere atanıyor
        let purchaseDay = req.session.purchaseDay;
        let purchaseMonth = req.session.purchaseMonth;

        let deliveryDay = req.session.deliveryDay;
        let deliveryMonth = req.session.deliveryMonth;

        // Seçilen aylara göre fiyatta hata çıkmaması için 3 ihtimal için şart konuluyor
        // teslim tarihinin  alış tarihinden büyük olması gerekiyor
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

            // aynı ay içerisinde sipariş verilirse bu şart bloğu çalışır
        } else if (deliveryMonth == purchaseMonth) {

            console.log("ayların ikisi aynı");

            totalPaidDays = deliveryDay - purchaseDay;

            console.log("toplam ücretli gün: " + totalPaidDays);

            // alış tarihi teslim tarihinden büyük olamaz
            // yani geçmişe dönük kiralama zaten yapılamaz
        } else if (deliveryMonth < purchaseMonth) {

            console.log("alış tarihi, teslim tarihinden büyük olamaz!")

            res.redirect("/");
        }

        //hesaplamalar yapıldıktan sonra Türkiye'nin il ve ilçelerinin barındıran veri tabanı çağrılır

        CountryModel.find({}) // tüm veri tabanı çağrılacağı için find() kısmı boş bırakılabilir
            .then((response) => {

                let country = response[0].turkey; // veri tabanında array olarak atandığı için response[0]. arrayi değişkene atanıyor

                for (let i = 0; i < country.length; i++) {

                    if (selectedProvince == country[i].il) { // seçilen il ile veri tabanındaki il aynıysa onun indeksi seçilir
                        console.log("seçilen il: " + country[i].il)

                        for (let j = 0; j < country[i].ilceler.length; j++) { 
                            if (selectedDistrict == country[i].ilceler[j][0]) {// ardından seçilen ilçenin veri tabanındaki ilçe ile aynı olup olmadığı kotnrol edilir ve o ilçe seçilir

                                console.log("Seçilen İlçe: " + country[i].ilceler[j][0])

                                let arrayOfCars = country[i].ilceler[j][1]; // seilen il ve ilçenin içinde bulunan araçların yerleştirilidiği index bulunur ve bir değişkene aktarılır

                                // sayfayı renderlama işlemi
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
    // Sayfa render edildiğinde res.render()'a gönderilecek olan değişkenler

    // kullanıcının daha önce giriş yapıp yapmadığı kontrol edilir
    if (!isAuth) {
        res.redirect("/");
    } else {
        //session yok edilir ve çıkış sayfası için hazırlanan sayfa render edilir
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