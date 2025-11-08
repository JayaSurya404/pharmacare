const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users with same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "pharmacy"], // only these roles allowed
    default: "customer",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
