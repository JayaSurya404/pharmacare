const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  pharmacyId: { type: String, required: true },  // pharmacy email or _id
  customerName: { type: String, required: true },
  medicineName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
