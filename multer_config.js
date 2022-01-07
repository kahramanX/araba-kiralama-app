// Sunucuya fotoğraf eklemek için kullanılan bir modül
// MongoDB'ye sunucuya eklenen fotoğrafın adresini gönderiyor
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const path = require("path");

// Eklenen fotoğrafların adresi aynı olmaması için fotoğraf adına random sayı eklenir
let random = Math.floor(Math.random() * 56278);

// Eklenen fotoğrafın hangi adrese ekleneceği ve fotoğraf adına ne yazılacağı seçiliyor
const myStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname,"/public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, req.session.mail+"-"+random+path.extname(file.originalname));
    }
})

//Eklenebilecek fotoğraf dosyası tipleri seçiliyor
const myFileFilter = (req,file,cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadResim = multer({storage: myStorage, fileFilter: myFileFilter});

module.exports = uploadResim;