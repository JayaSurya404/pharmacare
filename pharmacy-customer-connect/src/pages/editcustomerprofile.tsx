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
  FaUserFriends,
  FaIdCard,
  FaSave,
  FaTimes,
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
  emergencyContact?: EmergencyContact;
  insurance?: Insurance;
  prescriptions?: string[]; // array of prescription URLs
  prescription?: string; // single prescription URL for backward compatibility
}

const EditCustomerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile>({
    emergencyContact: {},
    insurance: {},
    prescriptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPrescriptions, setNewPrescriptions] = useState<File[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
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
        const data = res.data;

        // Merge old singular prescription into prescriptions array
        if (data.prescription && !data.prescriptions) {
          data.prescriptions = [data.prescription];
        } else if (data.prescription && data.prescriptions) {
          data.prescriptions = [data.prescription, ...data.prescriptions];
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (field: keyof CustomerProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleEmergencyChange = (field: keyof EmergencyContact, value: any) => {
    setProfile({
      ...profile,
      emergencyContact: { ...profile.emergencyContact, [field]: value },
    });
  };

  const handleInsuranceChange = (field: keyof Insurance, value: any) => {
    setProfile({
      ...profile,
      insurance: { ...profile.insurance, [field]: value },
    });
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPrescriptions([
        ...newPrescriptions,
        ...Array.from(e.target.files),
      ]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      let updatedPrescriptions = [...(profile.prescriptions || [])];

      // Upload new prescriptions
      if (newPrescriptions.length > 0) {
        const formData = new FormData();
        newPrescriptions.forEach((file) =>
          formData.append("prescriptions", file)
        );

        const uploadRes = await axios.post(
          `http://localhost:5000/api/customer/${email}/upload-prescriptions`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        updatedPrescriptions = [...updatedPrescriptions, ...uploadRes.data];
      }

      const updatedProfile = { ...profile, prescriptions: updatedPrescriptions };
      await axios.put(
        `http://localhost:5000/api/customer/${email}/profile`,
        updatedProfile
      );

      setNewPrescriptions([]);
      router.push("/customerprofile");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Edit Customer Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Basic fields */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full p-2 rounded-md border border-gray-300 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                type="text"
                value={profile.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                value={profile.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <input
                type="text"
                value={profile.bloodGroup || ""}
                onChange={(e) => handleChange("bloodGroup", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Allergies</label>
              <input
                type="text"
                value={profile.allergies || ""}
                onChange={(e) => handleChange("allergies", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Chronic Diseases</label>
              <input
                type="text"
                value={profile.chronicDiseases || ""}
                onChange={(e) => handleChange("chronicDiseases", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            {/* Upload new prescriptions */}
            <div>
              <label className="text-sm font-medium">Add New Prescriptions</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePrescriptionUpload}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            {/* Preview new uploads */}
            {newPrescriptions.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {newPrescriptions.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Prescription ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300 shadow cursor-pointer"
                    onClick={() => setFullscreenImage(URL.createObjectURL(file))}
                  />
                ))}
              </div>
            )}

            {/* Display existing prescriptions */}
            {profile.prescriptions && profile.prescriptions.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Existing Prescriptions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.prescriptions.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Existing Prescription ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 shadow cursor-pointer"
                      onClick={() => setFullscreenImage(url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Emergency Contact</h2>
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={profile.emergencyContact?.name || ""}
                onChange={(e) => handleEmergencyChange("name", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Relation</label>
              <input
                type="text"
                value={profile.emergencyContact?.relation || ""}
                onChange={(e) => handleEmergencyChange("relation", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                value={profile.emergencyContact?.phone || ""}
                onChange={(e) => handleEmergencyChange("phone", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-4">Insurance Details</h2>
            <div>
              <label className="text-sm font-medium">Provider</label>
              <input
                type="text"
                value={profile.insurance?.provider || ""}
                onChange={(e) => handleInsuranceChange("provider", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Policy Number</label>
              <input
                type="text"
                value={profile.insurance?.policyNumber || ""}
                onChange={(e) => handleInsuranceChange("policyNumber", e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-2"
          >
            <FaSave /> <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setFullscreenImage(null)}
          >
            <FaTimes />
          </button>
          <img
            src={fullscreenImage}
            alt="Prescription Fullscreen"
            className="max-h-full max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default EditCustomerProfilePage;
