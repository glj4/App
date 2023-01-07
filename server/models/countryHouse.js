const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const CountryHouseSchema = new Schema({
    name: { type: String, required: true },
    description:{ type: String, required: false },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    people: { type: Number, required: true },
    rooms: { type: Number, required: true },
    bookings: { type: JSON, required: false },
    images: { type: Array, required: false },
    baths: { type: Number, required: false },
    ubication: { type: JSON, required: true }
});

CountryHouseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CountryHouse', CountryHouseSchema);