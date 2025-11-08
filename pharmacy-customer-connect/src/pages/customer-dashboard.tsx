"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FaBars,
  FaPills,
  FaPrescriptionBottleAlt,
  FaSignOutAlt,
  FaUser,
  FaUserEdit,
  FaUserMd,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";

interface Medicine {
  _id: string;
  name: string;
  category: string;
  dosage: string;
  nextRefillDate: string;
  status: string;
}

interface Profile {
  name: string;
  email: string;
  userType: string;
  memberSince: string;
  prescriptions?: string[];
}

const CustomerDashboard: React.FC = () => {
  const router = useRouter();

  // ✅ Added here (correct place)
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome!");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    dosage: "",
    nextRefillDate: "",
    status: "Pending",
  });

  // ✅ Fetch profile and medicines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          router.push("/login");
          return;
        }

        const profileRes = await axios.get(
          `http://localhost:5000/api/customer/${email}/profile`
        );
        setProfile(profileRes.data);
        setWelcomeMessage(`Welcome, ${profileRes.data.name}!`);

        const medsRes = await axios.get(
          `http://localhost:5000/api/customer/${email}/medicines`
        );
        setMedicines(medsRes.data);
      } catch (err: any) {
        console.error("Error fetching customer data:", err);
        setError(
          err.response?.status === 404
            ? "Customer data not found. Please check if account exists."
            : "Failed to load data. Please try again later."
        );
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleSearchClick = () => {
    router.push("/customersearch"); // 🔥 Opens search page
  };

  const handleAddMedicine = async () => {
    try {
      const email = profile?.email;
      if (!email) return;
      const res = await axios.post(
        `http://localhost:5000/api/customer/${email}/medicines`,
        newMedicine
      );
      setMedicines([...medicines, res.data]);
      setAddMedicineOpen(false);
      setNewMedicine({
        name: "",
        category: "",
        dosage: "",
        nextRefillDate: "",
        status: "Pending",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add medicine. Try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <FaPrescriptionBottleAlt className="text-2xl text-green-400 mr-2" />
              <span className="text-xl font-bold text-green-400">PharmaCare</span>
            </div>

            {/* 🔍 Search Button */}
            <button
              onClick={handleSearchClick}
              className="hidden md:flex items-center bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2 transition-all duration-200"
            >
              <FaSearch className="text-gray-300 mr-2" />
              <span className="text-gray-300 font-medium text-sm">Search Medicines</span>
            </button>

            {/* Icons and Logout */}
            <div className="hidden sm:flex sm:items-center space-x-4">
              <FaBell className="text-xl text-yellow-400 cursor-pointer" />
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Logout <FaSignOutAlt className="ml-1 inline" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {error && (
          <div className="bg-red-700 text-white p-3 rounded-md mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-900 p-3 rounded-full">
                  <FaUserMd className="text-green-400 text-2xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{welcomeMessage}</h2>
                  <p className="text-gray-400">
                    Today is{" "}
                    <span className="font-medium text-white">{currentDate}</span>
                  </p>
                  <p className="text-gray-400">
                    Here's your medication overview for today
                  </p>
                </div>
              </div>
            </div>

            {/* Medicines List */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Medicines</h2>
                <button
                  onClick={() => setAddMedicineOpen(true)}
                  className="text-blue-400 hover:text-blue-500 text-sm font-medium"
                >
                  <FaPills className="inline mr-1" /> Add Medicine
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                        Medicine Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                        Dosage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                        Next Refill Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {medicines.length > 0 ? (
                      medicines.map((med) => (
                        <tr key={med._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-white">
                              {med.name}
                            </span>
                            <br />
                            <span className="text-sm text-gray-400">
                              {med.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">{med.dosage}</td>
                          <td className="px-6 py-4">
                            {new Date(med.nextRefillDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-700 text-green-200">
                              {med.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-400">
                          No medicines found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-green-900 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-400 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">Profile Summary</h2>
                  <p className="text-sm text-gray-400">Your account details</p>
                </div>
              </div>

              {profile ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Name</p>
                    <p className="text-sm font-semibold text-white">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-white">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">User Type</p>
                    <p className="text-sm font-semibold text-white">{profile.userType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Member Since</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(profile.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Loading profile...</p>
              )}

              <button
                onClick={() => router.push("/customerprofile")}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center"
              >
                <FaUserEdit className="inline mr-2" /> Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
