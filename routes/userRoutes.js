const express = require('express');
let {
    check,
    validationResult
} = require("express-validator");

const userController = require('../controller/userController');

const router = express.Router();

router.get("/giris", userController.getGirisPage);

router.post("/giris", [

    check("mail", "Mail alanı boş bırakılamaz!")
    .isEmail(),
    check("password", "Şifre boş bırakılamaz!")
    .isLength({
        min: 5
    })

], userController.postGirisPage);

router.get("/kayit", userController.getKayitPage);

router.post("/kayit", [

    check("username", "Adınız, 2 harften az olamaz!")
    .exists()
    .isLength({
        min: 2
    }),
    check("surname", "Soyadınız, 2 harften az olamaz!")
    .exists()
    .isLength({
        min: 2
    }),
    check("mail", "Mail adresi boş bırakılamaz!")
    .isEmail(),
    check("password", "Şifre en az 5 karakterli olmalı!")
    .isLength({
        min: 5
    }),
    check("phone", "Telefon numarası en fazla 10 karakter olmalı ve '0' ile başlamamalı!")
    .isLength({
        min: 10,
        max: 10
    }),
    check("address", "Adres en az 15 karakterden oluşmalı!")
    .isLength({
        min: 15
    })

], userController.postKayitPage);

// Kullanıcı paneli

router.get("/profil", userController.getProfilePage);

router.get("/cikis", userController.getCikisPage);

router.get("/profil/duzenle", userController.getDuzenlePage);

router.post("/profil/duzenle", [
    check("username", "Adınız en az 2 karakter içermeli!")
    .exists()
    .isLength({min: 2})
    .trim(),
    check("surname", "Adınız en az 2 karakter içermeli!")
    .exists()
    .isLength({min: 2})
    .trim(),
    check("password", "Şifre en az 5 karakterli olmalı!")
    .isLength({
        min: 5
    }),
    check("mail", "Mail adresinizi doğru yazınız")
    .isEmail()
    .normalizeEmail(),
    check("phone", "Telefon numarası en fazla 10 karakter olmalı ve '0' ile başlamamalı")
    .isLength({min: 10, max: 10}),
    check("address", "Adresiniz en az 15 karakter olmalı!")
    .isLength({min: 15})
], userController.postDuzenlePage);

router.get("/profil/kiralanan-araclar", userController.getMyRentalCarsPage);

router.post("/profil/kiralanan-araclar", userController.postMyRentalCarsPage);

router.get("/profil/arac-ekle", userController.getAddACarPage);

router.post("/profil/arac-ekle", userController.postAddACarPage);

router.get("/profil/araclarim", userController.getOwnCarsPage);

router.post("/profil/araclarim", userController.postOwnCarsPage);




module.exports = router;