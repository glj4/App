const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const UserExperienceSchema = new Schema({
    user: { type: String, required: true },
    title:{ type: String, required: false },
    description: { type: String, required: true },
    location: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    images: { type: Array, required: false },
    isPublished: { type: Boolean, required: false }
});

UserExperienceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('UserExperience', UserExperienceSchema);