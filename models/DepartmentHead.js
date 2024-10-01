const mongoose = require('mongoose');

const DepartmentHeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String },  // URL to the head's photo
});

module.exports = mongoose.model('DepartmentHead', DepartmentHeadSchema);