import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Your backend URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { term } = req.query;

  if (!term) return res.status(400).json({ message: "Missing term parameter" });

  try {
    const response = await axios.get(`${BASE_URL}/medicines?search=${term}`);
    const suggestions = response.data.map((m: any) => m.name);
    res.status(200).json(suggestions);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
}
