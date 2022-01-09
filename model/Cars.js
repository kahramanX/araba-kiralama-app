//mongodb ile iletişim için mongoose modülü import ediliyor
const mongoose = require('mongoose');

const Schema = mongoose.Schema;// mongoose altında bulunan mongoose.Schema değişkene atanıyor

// Schema ile veritabanında bilgilerin yerleştirilecek olan veriler ve  o verilerin tipleri belirleniyor
const carsSchema = new Schema({
    carName: String,
    carModel: String,
    carBodyType: String,
    carEngineCapacity: String,
    fuelConsumption: String,
    abs: String,
    airBag: String,
    carbonEmission: String,
    seats: String,
    carTrunk: String,
    doors: String,
    gear: String,
    fuelType: String,
    cruiseControl: String,
    yearOfProduction: String,
    deposit: Number,
    hourlyRate: Number,
    carProvince: String,
    carDistrict: String,
    isRented: Boolean,
    isListed: Boolean,
    image: String,
    ownerAdmin: {
        ownerName: String,
        ownerSurname: String,
        ownerMail: String,
        ownerPhone: String,
        ownerAddress: String
    },
    renterUser: {
        renterName: String,
        renterSurname: String,
        renterMail: String,
        renterPhone: String,
        renterAddress: String
    }
})

// mongodb veritabanında Cars Collection'nuna ekleneceğini gösteriyor
const CarsModel = mongoose.model("Cars", carsSchema);

//Diğer dosyalarda kullanılmak üzere export ediliyor
module.exports = CarsModel;