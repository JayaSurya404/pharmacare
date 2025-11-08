import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaStore,
  FaShoppingCart,
} from "react-icons/fa";

interface Pharmacy {
  fullName: string;
  pharmacyName: string;
  storeName: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  shopAddress: string;
  shopPhone: string;
  shopDescription: string;
  shopHours: string;
  profilePhoto?: string;
  shopPhoto?: string;
  bio?: string;
}

interface Medicine {
  medicineName: string;
  price: number;
  stock: number;
}

const PharmacyDetailsPage: React.FC = () => {
  const router = useRouter();
  const { email, medicine } = router.query;
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [targetMedicine, setTargetMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (email && medicine) {
      fetchPharmacyAndMedicine(email as string, medicine as string);
    }
  }, [email, medicine]);

  const fetchPharmacyAndMedicine = async (
    email: string,
    medicineName: string
  ) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/pharmacy-details?email=${email}`
      );
      const pharmacyData = res.data.pharmacy;
      const allMedicines = res.data.medicines || [];

      const foundMed = allMedicines.find(
        (m: Medicine) =>
          m.medicineName.toLowerCase() === medicineName.toLowerCase()
      );

      setPharmacy(pharmacyData);
      setTargetMedicine(foundMed || null);
    } catch (err) {
      console.error("Error fetching pharmacy details:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated handleOrder() — redirects to payment page with query params
  const handleOrder = () => {
    if (!pharmacy || !targetMedicine) return;

    const customerEmail = localStorage.getItem("userEmail");
    if (!customerEmail) {
      alert("Please log in to place a request.");
      router.push("/login");
      return;
    }

    // Redirect to payment page with query params
    router.push({
      pathname: "/payment",
      query: {
        pharmacyEmail: pharmacy.email,
        pharmacyName: pharmacy.pharmacyName,
        medicineName: targetMedicine.medicineName,
        amount: targetMedicine.price,
        quantity: 1,
        customerEmail,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading pharmacy...</p>
      </div>
    );
  }

  if (!pharmacy || !targetMedicine) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-lg text-red-400 text-center">
          {targetMedicine === null
            ? `Medicine "${medicine}" not available at this pharmacy.`
            : "Pharmacy not found."}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 sm:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm text-gray-300"
      >
        ← Back to Search
      </button>

      {/* Pharmacy Header */}
      <div className="flex flex-col lg:flex-row gap-6 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="lg:w-1/3">
          <img
            src={pharmacy.shopPhoto || "/pharmacyshopphoto.png"}
            alt={pharmacy.pharmacyName}
            className="w-full h-64 object-cover rounded-xl border border-gray-700"
          />
        </div>

        <div className="lg:w-2/3 space-y-3">
          <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
            <FaStore /> {pharmacy.pharmacyName}
          </h1>
          <p className="text-gray-400 text-sm italic">{pharmacy.bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <p className="flex items-center gap-2 text-gray-300">
              <FaMapMarkerAlt className="text-green-400" />{" "}
              {pharmacy.shopAddress}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <FaClock className="text-green-400" /> {pharmacy.shopHours}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <FaPhoneAlt className="text-green-400" /> {pharmacy.shopPhone}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <FaEnvelope className="text-green-400" /> {pharmacy.email}
            </p>
          </div>

          <p className="text-gray-300 mt-3">{pharmacy.shopDescription}</p>
        </div>
      </div>

      {/* Target Medicine Card */}
      <div className="mt-10 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-4">
          Requested Medicine
        </h2>

        <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
          <h3 className="text-xl font-bold text-white">
            {targetMedicine.medicineName}
          </h3>
          <p className="text-gray-300 mt-2">
            💰 Price:{" "}
            <span className="text-white font-semibold">
              ₹{targetMedicine.price}
            </span>
          </p>
          <p
            className={`mt-2 text-lg font-medium ${
              targetMedicine.stock > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {targetMedicine.stock > 0
              ? `✅ In Stock (${targetMedicine.stock} units)`
              : "❌ Out of Stock"}
          </p>

          <button
            onClick={handleOrder}
            disabled={targetMedicine.stock <= 0 || requesting}
            className={`mt-6 w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              targetMedicine.stock > 0 && !requesting
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {requesting ? (
              "Sending Request..."
            ) : (
              <>
                <FaShoppingCart /> Request Medicine
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsPage;
