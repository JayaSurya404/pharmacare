require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== DATABASE CONNECTION ==================
mongoose
  .connect("mongodb://127.0.0.1:27017/pharmacyDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================== SCHEMAS ==================

// User Schema
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["customer", "pharmacy"], default: "customer" },
});
const User = mongoose.model("User", userSchema);

// Customer Profile Schema
const customerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  medicines: [
    {
      name: String,
      dosage: String,
      refillDate: String,
      status: String,
      category: String,
    },
  ],
  memberSince: { type: Date, default: Date.now },
});
const CustomerProfile = mongoose.model("CustomerProfile", customerProfileSchema);

// Pharmacy Profile Schema
const pharmacyProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  storeName: String,
  medicines: [
    {
      _id: String,
      name: String,
      stock: Number,
      price: Number,
      expiryDate: String,
      status: String,
      brand: String,
      category: String,
      description: String,
      image: String,
      requiresPrescription: Boolean,
      batchNumber: String,
      manufactureDate: String,
      pharmacyEmail: String,
    },
  ],
  fullName: String,
  phone: String,
  address: String,
  bio: String,
  pharmacyName: String,
  licenseNumber: String,
  shopAddress: String,
  shopPhone: String,
  shopDescription: String,
  shopHours: String,
  profilePhoto: String,
  shopPhoto: String,
  memberSince: { type: Date, default: Date.now },
});
const PharmacyProfile = mongoose.model("PharmacyProfile", pharmacyProfileSchema);

// Request Schema
const requestSchema = new mongoose.Schema({
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: "PharmacyProfile", required: true },
  customerName: { type: String, required: true },
  medicineName: { type: String, required: true },
  time: { type: String, required: true },
});
const Request = mongoose.model("Request", requestSchema);

// ================== ROUTES ==================

// Test Route
app.get("/api/test", (req, res) => res.json({ message: "Backend is connected ✅" }));

// -------------------- AUTH ROUTES --------------------
app.post("/api/signup", async (req, res) => {
  try {
    const { fullname, email, password, userType } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword, userType });
    await newUser.save();

    if (userType === "customer") {
      await CustomerProfile.create({ userId: newUser._id, name: fullname, email, medicines: [] });
    } else if (userType === "pharmacy") {
      await PharmacyProfile.create({ userId: newUser._id, name: fullname, email, storeName: "My Pharmacy", medicines: [] });
    }

    res.status(201).json({ message: "Signup successful 🎉" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Something went wrong on the server ❌" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials ❌" });

    res.json({ message: "Login successful 🎉", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong on the server ❌" });
  }
});

// -------------------- CUSTOMER ROUTES --------------------
app.get("/api/customer/:email/profile", async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json({ message: "Customer profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customer profile" });
  }
});

app.get("/api/customer/:email/medicines", async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({ email: req.params.email }, { medicines: 1 });
    if (!profile) return res.status(404).json({ message: "Customer medicines not found" });
    res.json(profile.medicines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
});

// -------------------- PHARMACY ROUTES --------------------

// Helper to fetch pharmacy by ID or email
async function getPharmacy(identifier) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await PharmacyProfile.findById(identifier);
    if (byId) return byId;
  }
  return await PharmacyProfile.findOne({ email: identifier });
}

// Get Pharmacy Profile (by ID or email)
app.get("/api/pharmacy/:identifier/profile", async (req, res) => {
  try {
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    res.json({
      _id: pharmacy._id,
      userId: pharmacy.userId,
      fullName: pharmacy.fullName,
      name: pharmacy.name,
      email: pharmacy.email,
      phone: pharmacy.phone,
      address: pharmacy.address,
      bio: pharmacy.bio,
      storeName: pharmacy.storeName,
      pharmacyName: pharmacy.pharmacyName,
      licenseNumber: pharmacy.licenseNumber,
      memberSince: pharmacy.memberSince,
      shopAddress: pharmacy.shopAddress,
      shopPhone: pharmacy.shopPhone,
      shopDescription: pharmacy.shopDescription,
      shopHours: pharmacy.shopHours,
      profilePhoto: pharmacy.profilePhoto,
      shopPhoto: pharmacy.shopPhoto,
      medicines: pharmacy.medicines || [],
    });
  } catch (err) {
    console.error("Error fetching pharmacy profile:", err);
    res.status(500).json({ message: "Error fetching pharmacy profile ❌" });
  }
});

// Update Pharmacy Profile
app.put("/api/pharmacy/:identifier/updateProfile", async (req, res) => {
  try {
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    const allowedFields = [
      "fullName", "name", "phone", "address", "bio",
      "pharmacyName", "licenseNumber", "shopAddress",
      "shopPhone", "shopDescription", "shopHours",
      "profilePhoto", "shopPhoto", "storeName", "email"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) pharmacy[field] = req.body[field];
    });

    await pharmacy.save();
    res.json({ message: "Profile updated successfully ✅", pharmacy });
  } catch (err) {
    console.error("Error updating pharmacy profile:", err);
    res.status(500).json({ message: "Error updating profile ❌" });
  }
});

// Get Pharmacy Inventory
app.get("/api/pharmacy/:identifier/inventory", async (req, res) => {
  try {
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    const inventory = pharmacy.medicines.map((m) => ({
      _id: m._id,
      name: m.name,
      price: m.price,
      stock: m.stock,
      image: m.image || "/medicine.png",
      requiresPrescription: m.requiresPrescription || false,
      category: m.category || "",
      description: m.description || "",
      brand: m.brand || "",
      expiryDate: m.expiryDate || "",
      batchNumber: m.batchNumber || "",
      manufactureDate: m.manufactureDate || "",
      pharmacyEmail: m.pharmacyEmail || pharmacy.email,
      status: m.status || "",
    }));

    res.json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ message: "Error fetching inventory" });
  }
});

// -------------------- MEDICINE ROUTES --------------------

// Update Medicine
app.put("/api/pharmacy/:identifier/medicines/:medicineId", async (req, res) => {
  try {
    const { medicineId } = req.params;
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    const medicine = pharmacy.medicines.find((m) => m._id === medicineId);
    if (!medicine) return res.status(404).json({ message: "Medicine not found ❌" });

    const { name, price } = req.body;
    if (name !== undefined) medicine.name = name;
    if (price !== undefined) medicine.price = price;

    await pharmacy.save();
    res.json({ message: "Medicine updated successfully ✅", medicine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating medicine" });
  }
});

// Restock Medicine
app.put("/api/pharmacy/:identifier/medicines/:medicineId/restock", async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { stock } = req.body;
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    const medicine = pharmacy.medicines.find((m) => m._id === medicineId);
    if (!medicine) return res.status(404).json({ message: "Medicine not found ❌" });

    medicine.stock += stock;
    await pharmacy.save();
    res.json({ message: "Medicine restocked successfully ✅", medicine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error restocking medicine" });
  }
});

// -------------------- REQUEST ROUTES --------------------

// Send Request (supports pharmacy email or ObjectId)
app.post("/api/request", async (req, res) => {
  try {
    const { pharmacyId, customerName, medicineName } = req.body;
    if (!pharmacyId || !customerName || !medicineName) {
      return res.status(400).json({ message: "Missing required fields ❌" });
    }

    // If pharmacyId is actually an email, convert it to ObjectId
    let pharmacyRef = pharmacyId;
    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      const pharmacy = await PharmacyProfile.findOne({ email: pharmacyId });
      if (!pharmacy) {
        return res.status(404).json({ message: "Pharmacy not found ❌" });
      }
      pharmacyRef = pharmacy._id;
    }

    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const newRequest = new Request({
      pharmacyId: pharmacyRef,
      customerName,
      medicineName,
      time,
    });

    await newRequest.save();
    res.status(201).json({ message: "✅ Request sent successfully" });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// Get Requests
app.get("/api/pharmacy/:identifier/requests", async (req, res) => {
  try {
    const pharmacy = await getPharmacy(req.params.identifier);
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found ❌" });

    const requests = await Request.find({ pharmacyId: pharmacy._id });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests ❌" });
  }
});

// -------------------- SEARCH ROUTES --------------------

// Search Medicines Across Pharmacies
app.get("/api/search-medicine", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Medicine name is required ❌" });

    const regex = new RegExp(name, "i");
    const pharmacies = await PharmacyProfile.find({ "medicines.name": regex });

    const results = [];
    pharmacies.forEach((pharmacy) => {
      pharmacy.medicines
        .filter((m) => regex.test(m.name))
        .forEach((m) => {
          results.push({
            pharmacyId: pharmacy._id,
            pharmacyName: pharmacy.pharmacyName || pharmacy.storeName || pharmacy.name,
            address: pharmacy.shopAddress || pharmacy.address || "Address not available",
            medicineName: m.name,
            price: m.price,
            stock: m.stock,
             pharmacyEmail: pharmacy.email,
          });
        });
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching medicines ❌" });
  }
});

// Autocomplete Suggestions
app.get("/api/suggest-medicine", async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) return res.json([]);

    const regex = new RegExp(term, "i");
    const pharmacies = await PharmacyProfile.find({ "medicines.name": regex });

    const allNames = [];
    pharmacies.forEach((p) => {
      p.medicines.forEach((m) => {
        if (regex.test(m.name)) allNames.push(m.name);
      });
    });

    res.json([...new Set(allNames)].slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching suggestions ❌" });
  }
});

// ✅ Fetch pharmacy by ID (supports _id or userId)
app.get("/api/pharmacy/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("➡️ Pharmacy ID requested:", id);

    let pharmacy = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      pharmacy = await PharmacyProfile.findById(id);
    }

    if (!pharmacy) {
      pharmacy = await PharmacyProfile.findOne({ userId: id.toString() });
    }

    if (!pharmacy) {
      console.log("❌ Pharmacy not found for ID:", id);
      return res.status(404).json({ message: "Pharmacy not found ❌" });
    }

    console.log("✅ Pharmacy found:", pharmacy.pharmacyName || pharmacy.storeName);

    res.json({
      _id: pharmacy._id,
      userId: pharmacy.userId,
      fullName: pharmacy.fullName,
      name: pharmacy.name,
      email: pharmacy.email,
      phone: pharmacy.phone,
      address: pharmacy.address,
      bio: pharmacy.bio,
      storeName: pharmacy.storeName,
      pharmacyName: pharmacy.pharmacyName,
      licenseNumber: pharmacy.licenseNumber,
      memberSince: pharmacy.memberSince,
      shopAddress: pharmacy.shopAddress,
      shopPhone: pharmacy.shopPhone,
      shopDescription: pharmacy.shopDescription,
      shopHours: pharmacy.shopHours,
      profilePhoto: pharmacy.profilePhoto,
      shopPhoto: pharmacy.shopPhoto,
      medicines: pharmacy.medicines || [],
    });
  } catch (error) {
    console.error("Error fetching pharmacy:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✅ CORRECTED & ONLY VERSION: Get pharmacy details + medicines by EMAIL
app.get("/api/pharmacy-details", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required ❌" });
    }

    const pharmacy = await PharmacyProfile.findOne({ email });
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found ❌" });
    }

    const medicines = pharmacy.medicines.map((med) => ({
      medicineName: med.name,
      price: med.price,
      stock: med.stock,
    }));

    res.json({
      pharmacy: {
        fullName: pharmacy.fullName,
        pharmacyName: pharmacy.pharmacyName,
        storeName: pharmacy.storeName,
        email: pharmacy.email,
        phone: pharmacy.phone,
        address: pharmacy.address,
        shopAddress: pharmacy.shopAddress,
        shopPhone: pharmacy.shopPhone,
        shopDescription: pharmacy.shopDescription,
        shopHours: pharmacy.shopHours,
        profilePhoto: pharmacy.profilePhoto,
        shopPhoto: pharmacy.shopPhoto,
        bio: pharmacy.bio,
        licenseNumber: pharmacy.licenseNumber,
      },
      medicines,
    });
  } catch (error) {
    console.error("Error fetching pharmacy details:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ================== PAYMENT VERIFICATION SERVER ==================
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51SQNgCLIlGwVjCVTqxcdswHtfrNizajJ2BHvIkEZq7fcRaUcQCXP3hzDNdEssoSFGuD7TmXZ01M6EqwEzVjQ2931004HAgYXcd"
);

app.post("/api/payment/confirm", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      console.log("✅ Payment verified successfully:", sessionId);
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("❌ Stripe verification failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// ================== STRIPE CHECKOUT SESSION CREATION ==================
app.post("/api/payment/create-checkout-session", async (req, res) => {
  try {
    const { pharmacyEmail, customerEmail, medicineName, amount, quantity } = req.body;

    if (!customerEmail || !medicineName || !amount) {
      return res.status(400).json({ error: "Missing required fields ❌" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: medicineName,
              description: `Purchased from ${pharmacyEmail}`,
            },
            unit_amount: Math.round(Number(amount) * 100), // ₹ → paise
          },
          quantity: quantity || 1,
        },
      ],
      customer_email: customerEmail,
      success_url: "http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment-failed",
    });

    console.log("✅ Checkout session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe checkout creation failed:", error);
    res.status(500).json({ error: "Internal server error ❌" });
  }
});



// ================== SERVER ==================
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
