const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get("/giris", userController.getGirisPage);

router.post("/giris", userController.postGirisPage);

router.get("/kayit", userController.getKayitPage);

router.post("/kayit", userController.postKayitPage);

// Kullanıcı paneli

router.get("/profil", userController.getProfilePage);

router.get("/cikis", userController.getCikisPage);

router.get("/profil/duzenle", userController.getDuzenlePage);

router.post("/profil/duzenle", userController.postDuzenlePage);

router.get("/profil/kiralanan-araclar", userController.getMyRentalCarsPage);

router.post("/profil/kiralanan-araclar", userController.postMyRentalCarsPage);

module.exports = router;