"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Save, ArrowLeft, Camera } from "react-feather";

interface PharmacyProfile {
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  storeName: string;
  pharmacyName?: string;
  licenseNumber: string;
  memberSince?: string;
  shopAddress: string;
  shopPhone: string;
  shopDescription: string;
  shopHours: string;
  profilePhoto?: string;
  shopPhoto?: string;
}

const EditPharmacyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    AOS.init();
    const email = localStorage.getItem("email");
    if (!email) {
      setMessage("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pharmacy/${email}/profile`);
        if (!res.ok) throw new Error("Profile not found");
       const data = await res.json();
const p = data.pharmacy || data; // ✅ FIXED LINE

setProfile({
  name: p.name || p.fullName || "",
  fullName: p.fullName || p.name || "",
  email: p.email || "",
  phone: p.phone || "",
  address: p.address || "",
  bio: p.bio || "",
  storeName: p.storeName || "",
  pharmacyName: p.pharmacyName || p.storeName || "",
  licenseNumber: p.licenseNumber || "",
  memberSince: p.memberSince || "",
  shopAddress: p.shopAddress || "",
  shopPhone: p.shopPhone || "",
  shopDescription: p.shopDescription || "",
  shopHours: p.shopHours || "",
  profilePhoto: p.profilePhoto || "",
  shopPhoto: p.shopPhoto || "",
});

      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      const res = await fetch(`http://localhost:5000/api/pharmacy/${profile.email}/updateProfile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      setMessage("✅ Profile updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profilePhoto" | "shopPhoto") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (profile) setProfile({ ...profile, [type]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-10" data-aos="fade-up">
        <div className="flex items-center justify-between mb-8">
          <a href="/profile" className="flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back to Profile
          </a>
          <h1 className="text-3xl font-bold text-gray-800">Edit Pharmacy Profile</h1>
        </div>

        {message && <p className="text-center text-blue-600 mb-6">{message}</p>}

        {/* Pharmacist Info */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">Pharmacist Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" name="name" value={profile?.name || profile?.fullName || ""} onChange={handleChange} />
          <Input label="Email" name="email" value={profile?.email || ""} onChange={handleChange} disabled />
        </div>
        <Input label="Phone" name="phone" value={profile?.phone || ""} onChange={handleChange} />
        <Textarea label="Address" name="address" value={profile?.address || ""} onChange={handleChange} />
        <Textarea label="Bio" name="bio" value={profile?.bio || ""} onChange={handleChange} />

        {/* Pharmacy Details */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Pharmacy Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Store Name" name="storeName" value={profile?.storeName || ""} onChange={handleChange} />
          <Input label="Pharmacy Name" name="pharmacyName" value={profile?.pharmacyName || ""} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input label="License Number" name="licenseNumber" value={profile?.licenseNumber || ""} onChange={handleChange} />
          <Input label="Member Since" name="memberSince" value={profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : ""} onChange={handleChange} disabled />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Input label="Shop Address" name="shopAddress" value={profile?.shopAddress || ""} onChange={handleChange} />
          <Input label="Shop Phone" name="shopPhone" value={profile?.shopPhone || ""} onChange={handleChange} />
        </div>

        <Textarea label="Shop Description" name="shopDescription" value={profile?.shopDescription || ""} onChange={handleChange} />
        <Input label="Shop Hours" name="shopHours" value={profile?.shopHours || ""} onChange={handleChange} />

        {/* Photo Uploads */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center sm:space-x-10 items-center">
          <PhotoUpload label="Profile Photo" src={profile?.profilePhoto} onChange={(e) => handleFileUpload(e, "profilePhoto")} />
          <PhotoUpload label="Shop Photo" src={profile?.shopPhoto} onChange={(e) => handleFileUpload(e, "shopPhoto")} />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl hover:scale-105 transform transition-all flex items-center space-x-2 shadow-md"
          >
            <Save className="w-5 h-5" /> <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Input Component
const Input = ({ label, name, value, onChange, disabled }: { label: string; name: string; value: string; onChange: any; disabled?: boolean }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
  </div>
);

// Textarea Component
const Textarea = ({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: any }) => (
  <div className="mt-4">
    <label className="text-sm text-gray-600">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 border border-gray-300 rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

// Photo Upload Component
const PhotoUpload = ({ label, src, onChange }: { label: string; src?: string; onChange: any }) => (
  <div className="text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <div className="relative w-32 h-32 mt-2 mx-auto">
      <img
        src={src || "/default-avatar.png"}
        alt={label}
        className="w-full h-full rounded-full object-cover border border-gray-300 shadow"
      />
      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
        <Camera className="w-4 h-4" />
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
    </div>
  </div>
);

export default EditPharmacyProfilePage;
