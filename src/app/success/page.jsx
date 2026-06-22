"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

const BookingSuccessPage = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;
  return (
    <div>
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Your seat has been reserved successfully. The class schedule info
            will be sent to your email.
          </p>
          <button
            onClick={() => router.push(`/dashboard/${role}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
