"use client";

import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaTint,
  FaExclamationTriangle,
  FaFileMedical,
  FaEdit,
  FaUserFriends,
  FaIdCard,
  FaTimes, // ✅ Added for close button
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";

interface EmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

interface Insurance {
  provider?: string;
  policyNumber?: string;
}

interface CustomerProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  chronicDiseases?: string;
  memberSince?: string;
  profilePhoto?: string;
  prescription?: string; // single prescription image URL
  prescriptions?: string[]; // array of prescription URLs if multiple
  emergencyContact?: EmergencyContact;
  insurance?: Insurance;
}

const CustomerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // ✅ for modal image
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          router.push("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/customer/${email}/profile`
        );
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Customer Profile</h1>
          <button
            onClick={() => router.push("/editcustomerprofile")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <FaEdit /> <span>Edit Profile</span>
          </button>
        </div>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src={profile.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-green-500 object-cover"
                />
                <span className="text-xl font-semibold">
                  {profile.name || "—"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-green-600" />{" "}
                <span>{profile.email || "—"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaPhone className="text-green-600" />{" "}
                <span>{profile.phone || "—"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-green-600" />{" "}
                <span>{profile.address || "—"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaBirthdayCake className="text-green-600" />{" "}
                <span>
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaVenusMars className="text-green-600" />{" "}
                <span>{profile.gender || "—"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaTint className="text-green-600" />{" "}
                <span>Blood Group: {profile.bloodGroup || "—"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-green-600" />{" "}
                <span>Allergies: {profile.allergies || "None"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaFileMedical className="text-green-600" />{" "}
                <span>
                  Chronic Diseases: {profile.chronicDiseases || "None"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaIdCard className="text-green-600" />{" "}
                <span>
                  Member Since:{" "}
                  {profile.memberSince
                    ? new Date(profile.memberSince).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Emergency Contact
              </h2>
              <div className="flex items-center space-x-2">
                <FaUserFriends className="text-green-600" />
                <span>
                  {profile.emergencyContact?.name || "—"} (
                  {profile.emergencyContact?.relation || "—"}) -{" "}
                  {profile.emergencyContact?.phone || "—"}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                Insurance Details
              </h2>
              <div className="flex items-center space-x-2">
                <FaIdCard className="text-green-600" />
                <span>
                  {profile.insurance?.provider || "—"} -{" "}
                  {profile.insurance?.policyNumber || "—"}
                </span>
              </div>

              {/* Prescription Section */}
              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                Prescriptions
              </h2>

              {profile.prescriptions && profile.prescriptions.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {profile.prescriptions.map((prescription, index) => (
                    <img
                      key={index}
                      src={prescription}
                      alt={`Prescription ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-300 shadow cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedImage(prescription)} // ✅ Open full image
                    />
                  ))}
                </div>
              ) : profile.prescription ? (
                <div className="w-full">
                  <img
                    src={profile.prescription}
                    alt="Prescription"
                    className="w-full h-60 object-cover rounded-lg border border-gray-300 shadow cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedImage(profile.prescription)} // ✅ Open full image
                  />
                </div>
              ) : (
                <p className="text-gray-500">No prescriptions uploaded.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Modal for full-screen image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-red-500 transition"
          >
            <FaTimes />
          </button>

          {/* Full Image */}
          <img
            src={selectedImage}
            alt="Full Prescription"
            className="max-w-4xl max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;
