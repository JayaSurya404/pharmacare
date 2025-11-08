import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const confirm = async () => {
      if (!session_id) return;
      try {
        const res = await axios.post("http://localhost:5000/api/payment/confirm", {
          sessionId: session_id,
        });
        if (res.data.success) {
          setStatus("✅ Payment verified successfully!");
        } else {
          setStatus("❌ Payment not completed. Please try again.");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("❌ Error verifying payment. Please contact support.");
      }
    };
    confirm();
  }, [session_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Payment Status</h1>
      <p className="text-lg">{status}</p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
      >
        Go Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
