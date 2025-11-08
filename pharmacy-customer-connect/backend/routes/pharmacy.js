// routes/pharmacy.js
import express from "express";
import mongoose from "mongoose";
import Pharmacy from "../models/Pharmacy.js";

const router = express.Router();

// ==================== GET ALL PHARMACIES ====================
router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (err) {
    console.error("Error fetching pharmacies:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ==================== GET PHARMACY BY EMAIL ====================
router.get("/:email/profile", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ email: req.params.email });
    if (!pharmacy) return res.status(404).json({ msg: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ==================== GET PHARMACY INVENTORY ====================
router.get("/:email/inventory", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ email: req.params.email });
    res.json(pharmacy?.medicines || []);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ==================== MOCK REQUESTS ====================
router.get("/:email/requests", (req, res) => {
  res.json([
    { _id: 1, customerName: "Alice", medicineName: "Paracetamol", time: "10:00 AM" },
    { _id: 2, customerName: "Bob", medicineName: "Aspirin", time: "2:00 PM" },
  ]);
});

// ==================== GET PHARMACY BY ID ====================
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("➡️ Pharmacy ID requested:", id);

    // Try to find by Mongo ObjectId
    const pharmacy = await Pharmacy.findById(id);

    if (!pharmacy) {
      console.log("❌ Pharmacy not found for ID:", id);
      return res.status(404).json({ message: "Pharmacy not found ❌" });
    }

    console.log("✅ Pharmacy found:", pharmacy.storeName || pharmacy.name);
    res.json(pharmacy);
  } catch (err) {
    console.error("❌ Error fetching pharmacy details:", err);
    res.status(500).json({ message: "Server error ❌", error: err.message });
  }
});

export default router;
