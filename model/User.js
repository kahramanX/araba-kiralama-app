//mongodb ile iletişim için mongoose modülü import ediliyor
const mongoose = require('mongoose');

const Schema = mongoose.Schema; // mongoose altında bulunan mongoose.Schema değişkene atanıyor

// Schema ile veritabanında bilgilerin yerleştirilecek olan veriler ve  o verilerin tipleri belirleniyor
const usersSchema = new Schema({
    username: String,
    surname: String,
    mail: String,
    password: String,
    age: {
        type: Number,
        min: 18
    },
    phone: {
        type: Number,
    },
    address: String,
    //Üye olunan tarihi yazdırır
    createdDate: {
        type: Date,
        default: Date.now
    },
    rentedCar: Array,
})

// mongodb veritabanında Cars Collection'nuna ekleneceğini gösteriyor
const UserModel = mongoose.model("User", usersSchema);

//Diğer dosyalarda kullanılmak üzere export ediliyor
module.exports = UserModel;