const mongoose = require("mongoose");
const researchSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Ongoing Research", "Publications", "Research Groups"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: function () {
        return this.parent().type === "Ongoing Research";
      },
    },
  },
  { timestamps: true }
);

const Research = mongoose.model("Research", researchSchema);
module.exports = Research;