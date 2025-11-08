// pages/payment.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function PaymentPage() {
  const router = useRouter();
  const { pharmacyEmail, pharmacyName, medicineName, amount, quantity, customerEmail } = router.query;
  const [loading, setLoading] = useState(false);

  const createCheckout = async () => {
    if (!pharmacyEmail || !customerEmail || !medicineName || !amount) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/payment/create-checkout-session", {
        pharmacyEmail,
        customerEmail,
        medicineName,
        amount,
        quantity: quantity || 1,
      });

      // redirect user to checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error starting payment:", err);
      alert("Payment initialization failed. Check backend or network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-start once router query is ready
    if (router.isReady) createCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-400">Redirecting to secure checkout…</h1>
        <p className="mt-3 text-gray-300">You will be redirected to Stripe to complete the payment.</p>
        {loading && <p className="mt-4">Initializing payment...</p>}
      </div>
    </div>
  );
}
