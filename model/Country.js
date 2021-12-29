const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    turkey : Array
})

const Country = mongoose.model("country", countrySchema);

module.exports = Country;