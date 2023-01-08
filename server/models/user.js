const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true},
    phone: { type: String, required: false },
    points: { type: Number, required: false },
    bookings: { type: JSON, required: false },
    trips: { type: JSON, required: false },
    favorites: { type: JSON, required: false },
    likes: { type: JSON, required: false },
    tokenResetPassword: { type: String }
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);