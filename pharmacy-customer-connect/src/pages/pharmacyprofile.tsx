"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Edit, Camera, Mail, Phone, MapPin, FileText, Clock } from "react-feather";
import Link from "next/link";

interface PharmacyProfile {
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  storeName?: string;
  pharmacyName?: string;
  licenseNumber?: string;
  memberSince?: string;
  shopAddress?: string;
  shopPhone?: string;
  shopDescription?: string;
  shopHours?: string;
  profilePhoto?: string;
  shopPhoto?: string;
}

const PharmacyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init();
   const email =
  localStorage.getItem("pharmacyEmail") ||
  localStorage.getItem("userEmail") ||
  localStorage.getItem("email");

console.log("📩 Pharmacy email loaded:", email);

if (!email) {
  console.error("⚠️ No pharmacy email found in localStorage");
  return;
}

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pharmacy/${email}/profile`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load pharmacy profile ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!profile) return <p className="text-center text-gray-500 py-10">No profile data available.</p>;

  return (
    <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto">
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl"
          data-aos="fade-up"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-teal-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-white object-cover"
                />
                <Camera className="absolute bottom-0 right-0 w-5 h-5 text-white bg-green-700 rounded-full p-1" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {profile.storeName || "Pharmacy Store"}
                </h1>
                <p className="text-white/90">{profile.pharmacyName || "—"}</p>
              </div>
            </div>
            <Link
              href="/editpharmacyprofile"
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Content */}
          <div className="p-8 space-y-10">
            {/* Pharmacist Info */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">👨‍⚕️ Pharmacist Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                <Info label="Full Name" value={profile.fullName || profile.name} />
                <Info
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="inline w-4 h-4 text-gray-500 mr-1" />}
                />
                <Info
                  label="Phone"
                  value={profile.phone}
                  icon={<Phone className="inline w-4 h-4 text-gray-500 mr-1" />}
                />
                <Info label="License Number" value={profile.licenseNumber} />
                <Info
                  label="Member Since"
                  value={
                    profile.memberSince
                      ? new Date(profile.memberSince).toLocaleDateString()
                      : "—"
                  }
                  icon={<Clock className="inline w-4 h-4 text-gray-500 mr-1" />}
                />
              </div>
              <Info
                label="Address"
                value={profile.address}
                icon={<MapPin className="inline w-4 h-4 text-gray-500 mr-1" />}
              />
              <Info
                label="Bio"
                value={profile.bio}
                icon={<FileText className="inline w-4 h-4 text-gray-500 mr-1" />}
              />
            </section>

            {/* Pharmacy Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">🏪 Pharmacy Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                <Info label="Store Name" value={profile.storeName} />
                <Info label="Pharmacy Name" value={profile.pharmacyName} />
                <Info label="Shop Phone" value={profile.shopPhone} />
                <Info label="Shop Hours" value={profile.shopHours} />
              </div>
              <Info label="Shop Address" value={profile.shopAddress} />
              <Info label="Shop Description" value={profile.shopDescription} />
            </section>

            {/* Photos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">🖼️ Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <PhotoCard label="Profile Photo" src={profile.profilePhoto} />
                <PhotoCard label="Shop Photo" src={profile.shopPhoto} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-gray-900 flex items-center">
      {icon}
      {value || "—"}
    </p>
  </div>
);

const PhotoCard = ({ label, src }: { label: string; src?: string }) => (
  <div>
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <div className="relative w-32 h-32 mx-auto">
      <img
        src={src || "/default-avatar.jpg"}
        alt={label}
        className="w-full h-full rounded-full object-cover border border-gray-300 shadow"
      />
      <Camera className="absolute bottom-0 right-0 w-5 h-5 text-white bg-green-700 rounded-full p-1" />
    </div>
  </div>
);

export default PharmacyProfilePage;
