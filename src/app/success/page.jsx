"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Home, Loader2, XCircle } from "lucide-react";
import { getToken } from "@/components/service/getToken";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // "saving" | "saved" | "error"
  const [status, setStatus] = useState("saving");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Missing payment session information.");
      return;
    }

    const confirmBooking = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/confirm-booking`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          },
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("saved");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Failed to confirm your booking.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("Network issue while confirming your booking.");
      }
    };

    confirmBooking();
  }, [sessionId]);

  if (status === "saving") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-green-100 p-10 text-center">
          <div className="flex justify-center">
            <Loader2 className="w-14 h-14 text-green-600 animate-spin" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Confirming your booking…
          </h1>
          <p className="mt-3 text-gray-600">
            Please wait while we save your booking. Do not close this page.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Booking Not Saved
          </h1>
          <p className="mt-3 text-gray-600">{errorMessage}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100 transition"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-green-100 p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-bold text-gray-900">
          Booking Successful 🎉
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Thank you for your booking. Your payment has been received
          successfully.
        </p>

        {/* Booking Info */}
        <div className="mt-8 rounded-2xl border bg-gray-50 p-6 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600">Confirmed</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-900">Completed</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Booking Date</span>
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-green-700">
            Your booking has been confirmed. You can now view your booked
            classes from your dashboard.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard/my-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            View My Bookings
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
