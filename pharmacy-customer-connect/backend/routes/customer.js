import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// Get customer profile
router.get("/:email/profile", async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get customer medicines
router.get("/:email/medicines", async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    res.json(customer?.medicines || []);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
