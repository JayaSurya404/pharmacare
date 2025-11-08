// pages/checkout.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

type OrderDraft = {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyEmail?: string;
  medicine: { id: string; name: string; price: number };
  qty: number;
  subtotal: number;
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);

  // Address form
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "UPI">("COD");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    // Read order draft from session storage
    const raw = sessionStorage.getItem("pharmacyOrderDraft");
    if (raw) {
      const parsed: OrderDraft = JSON.parse(raw);
      setDraft(parsed);
      setLoading(false);
    } else {
      // No draft: redirect to homepage or show message
      setLoading(false);
    }
  }, []);

  const placeOrder = async () => {
    if (!draft) return alert("No order found.");
    if (!name || !mobile || !addressLine || !city || !pincode) {
      return alert("Please fill address fields.");
    }

    const orderPayload = {
      pharmacyId: draft.pharmacyId,
      pharmacyName: draft.pharmacyName,
      medicineId: draft.medicine.id,
      medicineName: draft.medicine.name,
      qty: draft.qty,
      price: draft.medicine.price,
      subtotal: draft.subtotal,
      customer: { name, mobile, addressLine, city, pincode },
      paymentMethod,
      status: paymentMethod === "COD" ? "pending" : "processing",
      createdAt: new Date().toISOString(),
    };

    try {
      setPlacing(true);

      // 1) If you have a payment API, call it here for CARD/UPI
      if (paymentMethod === "CARD" || paymentMethod === "UPI") {
        // Example placeholder call — replace with your real payment integration
        const paymentRes = await axios.post(`${BASE_URL}/api/process-payment`, {
          amount: orderPayload.subtotal,
          method: paymentMethod,
          // card/upi info would go here (for demo, we skip)
        });
        if (paymentRes.data?.status !== "paid") {
          throw new Error("Payment failed or not implemented");
        }
      }

      // 2) Create the order on backend
      // Create endpoint: POST /api/orders  (implement on server)
      const createRes = await axios.post(`${BASE_URL}/api/orders`, orderPayload);
      if (createRes.status === 201 || createRes.status === 200) {
        // clear draft
        sessionStorage.removeItem("pharmacyOrderDraft");
        // navigate to confirmation (pass order id if returned)
        const orderId = createRes.data?.orderId || createRes.data?.id || "";
        router.push({
          pathname: "/order-confirmation",
          query: { orderId },
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err: any) {
      console.error("Order error:", err?.response?.data || err.message || err);
      alert("Failed to place order. Check console for details.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!draft) return <div className="min-h-screen flex items-center justify-center">No order selected. Go back and choose a medicine.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-xl font-bold mb-4">Checkout</h1>

        <div className="mb-6">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-2 p-4 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{draft.medicine.name} x {draft.qty}</div>
                <div className="text-sm text-gray-500">{draft.pharmacyName}</div>
              </div>
              <div className="font-semibold">₹{draft.subtotal}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold">Delivery address</h2>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="border p-2 rounded" />
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" className="border p-2 rounded" />
            <input value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Address line" className="border p-2 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border p-2 rounded" />
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="border p-2 rounded" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold">Payment method</h2>
          <div className="mt-2 flex flex-col gap-2">
            <label className="flex items-center gap-3">
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <span>Cash on delivery (COD)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} />
              <span>Card (test)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
              <span>UPI (test)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold">₹{draft.subtotal}</div>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className={`px-6 py-3 rounded-lg text-white ${placing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
