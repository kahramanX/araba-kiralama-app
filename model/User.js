const mongoose = require('mongoose');
const Cars = require("./Cars");

const Schema = mongoose.Schema;

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
    createdDate: {
        type: Date,
        default: Date.now
    },
    ownCars: {
        type: Schema.Types.ObjectId,
        ref: "Cars"
    },
    rentedCar: {
        type: Schema.Types.ObjectId,
        ref: "Cars"
    },
    rentedOutCar: {
        type: Schema.Types.ObjectId,
        ref: "Cars"
    }
})

const User = mongoose.model("User", usersSchema);

module.exports = User;