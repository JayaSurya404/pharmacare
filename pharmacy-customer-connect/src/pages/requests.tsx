import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Check, X, Package } from "react-feather";

interface Request {
  _id: string;
  customerName: string;
  medicineName: string;
  quantity?: number;
  date?: string;
  status?: string;
}

const PharmacyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pharmacyEmail, setPharmacyEmail] = useState<string | null>(null);

  // ✅ Access localStorage only in client-side safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("pharmacyEmail");
      setPharmacyEmail(email);
    }
  }, []);

  // ✅ Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      if (!pharmacyEmail) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/pharmacy/${pharmacyEmail}/requests`
        );
        setRequests(res.data);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
        alert("Network Error! Please check your backend server connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [pharmacyEmail]);

  // ✅ Search functionality
  const filteredRequests = requests.filter(
    (r) =>
      r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Update request status (Approve / Reject / Delivered)
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Failed to update request status. Please try again.");
    }
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    delivered: "bg-blue-100 text-blue-700",
  };

  // ✅ Show login-required page if not logged in
  if (!pharmacyEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in to view your pharmacy requests.
        </p>
        <a
          href="/login"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">
            PharmaCare - Requests
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search requests..."
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="text-gray-500 w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Customer Medicine Requests
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {req.customerName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {req.medicineName || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {req.quantity || 1}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {req.date
                          ? new Date(req.date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            statusStyles[req.status || "pending"]
                          }`}
                        >
                          {(req.status
                            ? req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)
                            : "Pending")}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(req._id, "approved")}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                            >
                              <Check className="w-4 h-4 inline-block mr-1" />{" "}
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(req._id, "rejected")}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                            >
                              <X className="w-4 h-4 inline-block mr-1" /> Reject
                            </button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <button
                            onClick={() => updateStatus(req._id, "delivered")}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                          >
                            <Package className="w-4 h-4 inline-block mr-1" />{" "}
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default PharmacyRequestsPage;
