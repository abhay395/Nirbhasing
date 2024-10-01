const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },  // URL to the slider image
    caption: { type: String },  // Optional caption for the slider image
});

module.exports = mongoose.model('Slider', SliderSchema);