"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentPage = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const [classData, setClassData] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/api/classes/${id}`);
      const data = await res.json();
      setClassData(data);

      const payRes = await fetch(
        `${BASE_URL}/api/classes/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: data.price }),
        }
      );

      const payData = await payRes.json();
      setClientSecret(payData.clientSecret);
    };

    if (id) fetchData();
  }, [id, BASE_URL]);

  console.log(classData)
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      alert("🎉 Payment Successful!");
    }
  };

  if (!classData)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Checkout
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Complete your payment securely with Stripe
        </p>

        {/* Class Info Card */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {classData.classData.className}
          </h2>

          <div className="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-300">
            <span>Trainer: {classData.classData.trainerName}</span>
            <span>Category: {classData.classData.category}</span>
          </div>

          <p className="mt-2 text-xl font-bold text-blue-600 dark:text-blue-400">
            ${classData.classData.price}
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4">

          <div className="p-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!stripe || !clientSecret || loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;