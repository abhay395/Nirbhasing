const mongoose = require("mongoose");

const HeadlineSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["News", "Event", "Certificate"],
  },
  description: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
exports.Headline = mongoose.model("Headline", HeadlineSchema);
