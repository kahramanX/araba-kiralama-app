const mongoose = require('mongoose');
const User = require("./User");

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
    ownerAdmin: Array, 
    renterUser: Array
})

const Cars = mongoose.model("Cars", carsSchema);

module.exports = Cars;