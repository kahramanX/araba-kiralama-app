//mongodb ile iletişim için mongoose modülü import ediliyor
const mongoose = require('mongoose');

const Schema = mongoose.Schema; // mongoose altında bulunan mongoose.Schema değişkene atanıyor

// Schema ile veritabanında bilgilerin yerleştirilecek olan veriler ve  o verilerin tipleri belirleniyor
// bu veri zaten önceden veritabanına eklendiği için sadece array olarak çekmemiz gerektiğini belirtmemiz yetiyor
const countrySchema = new Schema({
    turkey : Array
})

// mongodb veritabanında Cars Collection'nuna ekleneceğini gösteriyor
const Country = mongoose.model("country", countrySchema);

//Diğer dosyalarda kullanılmak üzere export ediliyor
module.exports = Country;