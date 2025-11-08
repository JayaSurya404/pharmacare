import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaPills, FaStore } from "react-icons/fa";

interface SearchResult {
  pharmacyEmail: string;
  pharmacyName: string;
  address: string;
  medicineName: string;
  price: number;
  stock: number;
  shopPhoto?: string;
}

const CustomerSearchPage: React.FC = () => {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (query) {
      const q = query as string;
      setSearchTerm(q);
      fetchResults(q);
    } else {
      setLoading(false);
    }
  }, [query]);

  // ✅ Fetch medicine search results
  const fetchResults = async (name: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/search-medicine?name=${name}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch autocomplete suggestions
  const fetchSuggestions = async (term: string) => {
    try {
      if (term.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await axios.get(`${BASE_URL}/api/suggest-medicine?term=${term}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // ✅ Handle search click / Enter press
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/customersearch?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white px-4 sm:px-8 py-6">
      {/* Header + Search bar */}
      <div className="flex flex-col items-center justify-center mb-10 relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6 text-center">
          🔍 Find Medicines Near You
        </h1>

        <div className="w-full sm:w-3/4 lg:w-1/2 flex flex-col relative">
          {/* Search input */}
          <div className="flex bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="Search medicines..."
              className="w-full bg-gray-800 text-white px-4 py-3 focus:outline-none placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 px-5 py-3 flex items-center justify-center transition-all duration-200"
            >
              <FaSearch className="text-white text-lg" />
            </button>
          </div>

          {/* ✅ Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-14 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchTerm(item);
                    setSuggestions([]);
                    router.push(`/customersearch?query=${encodeURIComponent(item)}`);
                  }}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Results section */}
      {loading ? (
        <p className="text-center text-gray-400 mt-10">Loading results...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
          {results.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-md p-5 hover:border-green-500 hover:shadow-green-500/20 transition-all duration-300"
            >
              {/* Shop Photo */}
              {item.shopPhoto && (
                <img
                  src={item.shopPhoto}
                  alt={item.pharmacyName}
                  className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-700"
                />
              )}

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-green-400 flex items-center gap-2">
                  <FaStore /> {item.pharmacyName}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    item.stock > 0 ? "bg-green-700" : "bg-red-700"
                  }`}
                >
                  {item.stock > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-gray-400 flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-gray-500" /> {item.address}
              </p>

              <div className="bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-600">
                <p className="text-gray-300 text-sm">
                  <FaPills className="inline text-green-400 mr-2" />
                  <strong>{item.medicineName}</strong>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  💰 Price:{" "}
                  <span className="text-white font-semibold">₹{item.price}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  📦 Stock:{" "}
                  <span className="text-white font-semibold">{item.stock}</span>
                </p>
              </div>

              {/* ✅ View Shop button uses pharmacyEmail now instead of _id */}
              <button
  onClick={() =>
    router.push(
      `/pharmacy-details?email=${encodeURIComponent(item.pharmacyEmail)}&medicine=${encodeURIComponent(item.medicineName)}`
    )
  }
  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-all duration-300"
>
  View Shop
</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          No medicines found. Try searching something else.
        </p>
      )}
    </div>
  );
};

export default CustomerSearchPage;
