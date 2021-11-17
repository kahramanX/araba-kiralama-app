const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

app.post("/", userController.postHomePage);

app.get("/giris", userController.getGirisPage);

app.post("/giris", userController.postGirisPage);

app.get("/kayit", userController.getKayitPage);


app.post("/kayit", usercontroller.postKayitPage);

module.exports = router;