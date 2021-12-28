const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

const AdminModel = mongoose.model("Admins", AdminSchema);

module.exports = AdminModel;
