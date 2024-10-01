const mongoose = require('mongoose');


const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description:{type:String,required:true},
    duration:{type:String,required:true},
    mode:{type:String,required:true},
    skillsGained:{type:String,required:true},
})

module.exports = mongoose.model('Certification', certificationSchema)