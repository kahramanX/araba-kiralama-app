const User = require('../model/User');

module.exports.getGirisPage = (req, res) => {

    res.render("login.ejs");
};

module.exports.postGirisPage = (req, res) => {
    let {
        mail,
        password
    } = req.body;

    User.findOne(req.body).then((response) => {

        req.session.username = response.username;
        req.session.mail = response.mail;
        req.session.surname = response.surname;

        console.log(req.session.mail)

        req.session.save();

        res.send(`Mail: ${response.mail} <br> Şifre: ${response.password} <br> Bu bilgi ile giriş yaptınız`);


    }).catch((err) => {

        console.log("Bu mailde bir kullanıcı bulunamadı");

        res.send(`Mail: ${err.mail} <br> Şifre: ${err.password} <br> Bu bilgide kullanıcı bulunamadı`);

    })
};

module.exports.getKayitPage = (req, res) => {

    res.render("register.ejs");

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

            console.log("Bu mail ile giriş yapılabilir");

            newUser.save().then((response2) => {

                console.log(req.session.surname);
                console.log("üye kaydı yapıldı");

                res.send(`Bu mail => (${response2.mail}) ile kayıt yapıldı `);

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

    console.log(req.session.user);
    res.send(`<h1>${req.session.user}</h1>`);
}

module.exports.getCikisPage = (req, res) => {

    console.log(req.session.mail)

    
     req.session.destroy(function (err) {
        if (!err) {

            console.log(req.sessionID);
            res.send("session silindi<br><a href='/'> anasayfaya dön</a>");
        } else {

            console.log(err);
            res.send("session erişilemiyor");
        }
    });
}