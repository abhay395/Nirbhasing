const mongoose = require('mongoose')

const HeadlineSchema = new mongoose.Schema({
     type: {
        type: String,
        enum: ["News", "Event", "Requritment"],
     },
     description: {
        type: String,
        required: true
     },
     timestamp: {
        type: Date,
        default: Date.now
     }
})
exports.Headline= mongoose.model('Headline', HeadlineSchema)