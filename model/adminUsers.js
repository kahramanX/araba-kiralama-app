const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    createdDate: {
        type: Date,
        default: Date.now
    },
    ownCars: Array,
    rentedOutCar: Array
})

const AdminModel = mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;