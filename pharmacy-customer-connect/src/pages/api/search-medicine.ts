import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Your backend URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name) return res.status(400).json({ message: "Missing name parameter" });

  try {
    const response = await axios.get(`${BASE_URL}/pharmacies/search?medicine=${name}`);
    // Map backend data to the SearchResult interface
    const results = response.data.map((pharmacy: any) => {
      const med = pharmacy.medicines.find((m: any) =>
        m.name.toLowerCase().includes((name as string).toLowerCase())
      );
      return {
        pharmacyId: pharmacy._id,
        pharmacyName: pharmacy.pharmacyName || pharmacy.storeName || pharmacy.name,
        email: pharmacy.email,
        address: pharmacy.shopAddress || pharmacy.address || "Address not available",
        medicineName: med?.name || "",
        price: med?.price || 0,
        stock: med?.stock || 0,
      };
    });

    res.status(200).json(results);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching search results" });
  }
}
