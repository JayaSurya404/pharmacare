import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  dosage: { type: String },
  nextRefillDate: { type: String },
  status: { type: String, default: "Active" },
});

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  medicines: [medicineSchema],
  memberSince: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
