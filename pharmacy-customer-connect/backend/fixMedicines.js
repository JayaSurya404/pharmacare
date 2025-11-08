import mongoose from "mongoose";
import PharmacyProfile from "./models/Pharmacy.js"; // ✅ adjust path if needed

const MONGO_URI = "mongodb://127.0.0.1:27017/pharmacyDB";

async function fixMedicines() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    const pharmacies = await PharmacyProfile.find();
    let updatedCount = 0;

    for (const pharmacy of pharmacies) {
      let changed = false;
      pharmacy.medicines.forEach((med) => {
        if (!med._id) {
          med._id = new mongoose.Types.ObjectId(); // ✅ add a unique id
          changed = true;
        }
      });

      if (changed) {
        await pharmacy.save();
        updatedCount++;
      }
    }

    console.log(`✅ Fixed medicines for ${updatedCount} pharmacies`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing medicines:", err);
    process.exit(1);
  }
}

fixMedicines();
