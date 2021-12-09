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
    createdDate: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User", usersSchema);

module.exports = User;