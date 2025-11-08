import React, { useState, useEffect } from "react";
import axios from "axios";
import PharmacyProfilePage from "./pharmacyprofile";    

interface Medicine {
  _id: string;
  name: string;
  stock: number;
  price: number;
  expiryDate: string;
  status: string;
}

interface Request {
  _id: string;
  customerName: string;
  medicineName: string;
  time: string;
}

interface PharmacyProfile {
  name: string;
  storeName: string;
  email: string;
  memberSince: string;
}

const PharmacyDashboard: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);

  // Search states
  const [inventorySearch, setInventorySearch] = useState("");
  const [requestsSearch, setRequestsSearch] = useState("");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));

    const fetchData = async () => {
      try {
        const email = localStorage.getItem("pharmacyEmail");
        if (!email) {
          console.error("No pharmacy email found in localStorage");
          return;
        }

        const profileRes = await axios.get(
          `http://localhost:5000/api/pharmacy/${email}/profile`
        );
        setProfile(profileRes.data);

        const invRes = await axios.get(
          `http://localhost:5000/api/pharmacy/${email}/inventory`
        );
        setInventory(invRes.data);

        const reqRes = await axios.get(
          `http://localhost:5000/api/pharmacy/${email}/requests`
        );
        setRequests(reqRes.data);
      } catch (error) {
        console.error("Error fetching pharmacy data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtered lists based on search
  const filteredInventory = inventory
    .filter((med) =>
      med.name.toLowerCase().includes(inventorySearch.toLowerCase())
    )
    .slice(0, 3); // only show 3 medicines in dashboard preview

  const filteredRequests = requests.filter(
    (req) =>
      req.customerName.toLowerCase().includes(requestsSearch.toLowerCase()) ||
      req.medicineName.toLowerCase().includes(requestsSearch.toLowerCase())
  )
  .slice(0, 1);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <i className="fas fa-prescription-bottle-alt text-green-400 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-green-400">PharmaCare</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600">
                  Dashboard
                </a>
                <a href="/inventory" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Inventory
                </a>
                <a href="/requests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Requests
                </a>
                <a href="/pharmacyprofile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Profile
                </a>
                <a href="/" className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700">
                  Logout
                </a>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Welcome */}
        <div className="bg-gray-800 rounded-xl shadow-md mb-6 p-6">
          <h2 className="text-2xl font-bold">
            Welcome, {profile?.storeName || profile?.name || "Pharmacy"}!
          </h2>
          <p className="text-gray-400">
            Today is <span className="font-medium text-white">{currentDate}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Inventory Preview</h2>
            
            {/* Inventory Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search inventory..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((med) => (
                      <tr key={med._id}>
                        <td className="px-6 py-4 font-semibold text-white">{med.name}</td>
                        <td className="px-6 py-4">{med.stock}</td>
                        <td className="px-6 py-4">₹{med.price}</td>
                        <td className="px-6 py-4">{med.expiryDate}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-700 text-green-200">
                            {med.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-400">
                        No medicines found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* View Full Inventory */}
            <div className="mt-4 flex justify-end">
              <a
                href="/inventory"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-semibold"
              >
                View Full Inventory
              </a>
            </div>
          </div>

          {/* Requests + Profile */}
          <div className="space-y-6">
            {/* Requests */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Customer Requests</h2>

              {/* Requests Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={requestsSearch}
                  onChange={(e) => setRequestsSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <div key={req._id} className="mb-3">
                    <p className="text-sm font-medium text-white">
                      {req.customerName} requested{" "}
                      <span className="text-blue-400">{req.medicineName}</span>
                    </p>
                    <p className="text-xs text-gray-400">{req.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No requests found</p>
              )}
            </div>

            {/* Profile */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Pharmacy Profile</h2>
              {profile ? (
                <div className="space-y-2">
                  <p><span className="text-gray-400">Name:</span> <span className="text-white font-semibold">{profile.name}</span></p>
                  <p><span className="text-gray-400">Store:</span> <span className="text-white font-semibold">{profile.storeName}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="text-white font-semibold">{profile.email}</span></p>
                  <p><span className="text-gray-400">Member Since:</span> <span className="text-white font-semibold">{new Date(profile.memberSince).toLocaleDateString()}</span></p>
                </div>
              ) : (
                <p className="text-gray-400">Loading profile...</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
  