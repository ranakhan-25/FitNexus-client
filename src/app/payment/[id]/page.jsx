"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/components/service/getToken";
import { authClient } from "@/lib/auth-client";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [classData, setClassData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = authClient.useSession();

  const user = session?.user;

  // 1. Fetch Class Data
  useEffect(() => {
    if (!id) return;

    const getClassData = async () => {
      try {
        const token = await getToken();
        setPageLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/class/${id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          setClassData(data.data);
        } else {
          setError(data.message || "Failed to load class information.");
        }
      } catch (err) {
        setError("Network connection issue. Please try again.");
      } finally {
        setPageLoading(false);
      }
    };

    getClassData();
  }, [id]);

  // 2. Handle Booking Creation
  const handleBooking = async () => {
  if (!classData) return;

  try {
    setError(null);

    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: classData?._id,
          classImage: classData?.image,
          trainerId: classData?.trainerId,
          trainerName: classData?.trainerName,
          className: classData?.className,
          price: classData?.price,
          userId: user?._id || user?.id, 
          userEmail: user?.email,
        }),
      }
    );

    const data = await res.json();

    if (res.ok && data.success && data.url) {
      window.location.href = data.url;
    } else {
      setError(data.message || "Unable to complete booking request.");
    }
  } catch (err) {
    setError("An unexpected error occurred during booking.");
  }
};

  

  // ❌ 4. Graceful Error Interface (Error State)
  if (error || !classData) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">
            {error || "Sorry, the requested class could not be found."}
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:underline transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }


  // 💻 6. Primary Interactive Interface (Main UI)
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 mt-10 transition-colors duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header Metadata Block */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md mb-2 uppercase tracking-wider">
              {classData.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Confirm Booking
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400 uppercase font-medium tracking-wide">
              Price
            </p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
              ${classData.price}
            </p>
          </div>
        </div>

        <hr className="border-zinc-100 dark:border-zinc-800 my-4" />

        {/* Structured Information List */}
        <div className="space-y-4 my-6">
          <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              Class Name
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-right">
              {classData.className}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              Trainer
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-right">
              {classData.trainerName}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              Duration
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold text-right">
              {classData.duration}
            </span>
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-base"
          >
            Book Now
          </button>

          <button
            onClick={() => router.back()}
            className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
