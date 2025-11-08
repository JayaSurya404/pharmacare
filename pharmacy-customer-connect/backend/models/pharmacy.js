import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  expiryDate: { type: String },
  status: { type: String, default: "Available" },
});

const pharmacySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  storeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  medicines: [medicineSchema],
  memberSince: { type: Date, default: Date.now },
});

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema, "pharmacyprofiles");
export default Pharmacy;

