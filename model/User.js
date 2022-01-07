const mongoose = require('mongoose');

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
    //Üye olunan tarihi yazdırır
    createdDate: {
        type: Date,
        default: Date.now
    },
    rentedCar: Array,
})

const UserModel = mongoose.model("User", usersSchema);

module.exports = UserModel;