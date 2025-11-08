const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  requiresPrescription: { type: Boolean, default: false },
});

module.exports = mongoose.model("Medicine", medicineSchema);
