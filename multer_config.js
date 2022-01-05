const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const path = require("path");

let random = Math.floor(Math.random() * 56278);

const myStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname,"/public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, req.session.mail+"-"+random+path.extname(file.originalname));
    }
})

const myFileFilter = (req,file,cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadResim = multer({storage: myStorage, fileFilter: myFileFilter});


module.exports = uploadResim;