const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get("/giris", userController.getGirisPage);

router.post("/giris", userController.postGirisPage);

router.get("/kayit", userController.getKayitPage);

router.post("/kayit", userController.postKayitPage);

module.exports = router;