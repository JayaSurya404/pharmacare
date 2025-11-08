// pages/order-confirmation.tsx
import React from "react";
import { useRouter } from "next/router";

const OrderConfirmation: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Order placed 🎉</h1>
        <p className="text-gray-600 mb-4">Thanks — your order has been received.</p>
        {orderId ? <p className="text-sm text-gray-500">Order ID: <span className="font-medium">{orderId}</span></p> : null}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-blue-600 text-white rounded">Back to Home</button>
          <button onClick={() => router.push("/customer/orders")} className="px-4 py-2 border rounded">My Orders</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
