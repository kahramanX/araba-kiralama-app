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

        console.log(response);

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

    User.findOne({mail}).then((response) => { // maili object olarak ekle
                // response db'de bulunan tüm objeyi getiriyor
        if (response) {

            res.send(`Bu mail => (${response.mail}), zaten kullanılıyor.`);

        } else {

            console.log("Bu mail ile giriş yapılabilir");

            newUser.save().then((response2) => {

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