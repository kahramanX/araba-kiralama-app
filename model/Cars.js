const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    isRented: Boolean,
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

const Cars = mongoose.model("Cars", carsSchema);

module.exports = Cars;