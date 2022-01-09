//mongodb ile iletişim için mongoose modülü import ediliyor
const mongoose = require('mongoose');

const Schema = mongoose.Schema; // mongoose altında bulunan mongoose.Schema değişkene atanıyor

// Schema ile veritabanında bilgilerin yerleştirilecek olan veriler ve  o verilerin tipleri belirleniyor
const AdminSchema = new Schema({
    username: String,
    surname: String,
    mail: String,
    password: String,
    age: {
        type: String,
        min: 18
    },
    phone: {
        type: String,
    },
    address: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    ownCars: Array,
    rentedOutCar: Array
})

// mongodb veritabanında Admins Collection'nuna ekleneceğini gösteriyor
const AdminModel = mongoose.model("Admins", AdminSchema);

//Diğer dosyalarda kullanılmak üzere export ediliyor
module.exports = AdminModel;
