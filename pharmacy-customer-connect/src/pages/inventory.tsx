"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaExclamationCircle } from "react-icons/fa";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  expiryDate: string;
  status: string;
  image: string;
  requiresPrescription: boolean;
  batchNumber: string;
  manufactureDate: string;
  pharmacyEmail: string;
}

const InventoryPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [restockMed, setRestockMed] = useState<Medicine | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [updatedPrice, setUpdatedPrice] = useState<number>(0);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const email = localStorage.getItem("pharmacyEmail");
        if (!email) {
          setError("No pharmacy email found in localStorage.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/pharmacy/${email}/profile`
        );

        if (!res.data || !res.data.medicines) {
          setError("No medicines found.");
          setLoading(false);
          return;
        }

        setMedicines(res.data.medicines);
        setFilteredMedicines(res.data.medicines);
      } catch (err) {
        console.error(err);
        setError("Failed to load medicines.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMedicines(medicines);
    } else {
      setFilteredMedicines(
        medicines.filter((med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, medicines]);

  const handleEditSave = async () => {
    if (!editingMed) return;

    try {
      const email = localStorage.getItem("email");
      await axios.put(
        `http://localhost:5000/api/pharmacy/${email}/medicines/${editingMed._id}`,
        { name: editingMed.name, price: updatedPrice }
      );

      setMedicines((prev) =>
        prev.map((med) =>
          med._id === editingMed._id ? { ...med, name: editingMed.name, price: updatedPrice } : med
        )
      );
      setEditingMed(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update medicine.");
    }
  };

  const handleRestockSave = async () => {
    if (!restockMed) return;

    try {
      const email = localStorage.getItem("email");
      await axios.put(
        `http://localhost:5000/api/pharmacy/${email}/medicines/${restockMed._id}/restock`,
        { stock: newStock }
      );

      setMedicines((prev) =>
        prev.map((med) =>
          med._id === restockMed._id ? { ...med, stock: med.stock + newStock } : med
        )
      );
      setRestockMed(null);
      setNewStock(0);
    } catch (err) {
      console.error(err);
      alert("Failed to restock medicine.");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading medicines...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-900">💊 Pharmacy Inventory</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-green-900"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-3 text-left text-green-100">Name</th>
              <th className="p-3 text-left text-green-100">Brand</th>
              <th className="p-3 text-left text-green-100">Category</th>
              <th className="p-3 text-left text-green-100">Stock</th>
              <th className="p-3 text-left text-green-100">Price (₹)</th>
              <th className="p-3 text-left text-green-100">Expiry</th>
              <th className="p-3 text-left text-green-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med) => {
              const isLowStock = med.stock < 10;
              return (
                <tr
                  key={med._id}
                  className={`border-b hover:bg-green-50 transition ${
                    isLowStock ? "bg-red-50" : ""
                  }`}
                >
                  <td className="p-3 font-medium text-green-800">{med.name}</td>
                  <td className="p-3 text-green-700">{med.brand}</td>
                  <td className="p-3 text-green-700">{med.category}</td>
                  <td className="p-3 flex items-center text-green-700">
                    {med.stock}{" "}
                    {isLowStock && (
                      <FaExclamationCircle className="text-red-500 ml-2 animate-pulse" />
                    )}
                  </td>
                  <td className="p-3 text-green-800 font-semibold">₹{med.price.toFixed(2)}</td>
                  <td className="p-3 text-green-700">{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMed(med);
                        setUpdatedPrice(med.price);
                      }}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => setRestockMed(med)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <FaPlus className="mr-1" /> Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingMed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Medicine</h2>
            <input
              type="text"
              value={editingMed.name}
              onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(Number(e.target.value))}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingMed(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockMed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Restock Medicine</h2>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
              className="w-full mb-4 px-3 py-2 border rounded"
              placeholder="Add stock quantity"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRestockMed(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
