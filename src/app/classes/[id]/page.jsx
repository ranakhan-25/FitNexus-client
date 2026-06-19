"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ClassDetailsPage() {
  const { data: session, isLoading: authLoading } = authClient.useSession();

  const userId = session?.user?.id;

  console.log(userId);
  const { id } = useParams();
  const router = useRouter();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

  // -----------------------------
  // FETCH CLASS DETAILS
  // -----------------------------
  const fetchClassDetails = async () => {
    try {
      setLoading(true);

      // SAFE URL BUILD
      const params = new URLSearchParams();

      if (userId) {
        params.append("userId", userId);
      }

      if (userId) {
        const url = `${BASE_URL}/api/classes/${id}`
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || "Failed to load class details");
          return;
        }

        setClassData(data.classData);
        setAlreadyBooked(data.alreadyBooked || false);
        setFavorite(data.favorite || false);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      toast.error("Failed to load class details");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SAFE USE EFFECT
  // -----------------------------
  useEffect(() => {
    if (!id) return;
    if (authLoading) return;

    fetchClassDetails();
  }, [id, authLoading, userId]);

  // -----------------------------
  // BOOK NOW
  // -----------------------------
  const handleBookNow = () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (alreadyBooked) {
      toast.error("You already booked this class");
      return;
    }

    router.push(`/payment/${id}`);
  };

  // -----------------------------
  // FAVORITE
  // -----------------------------
  const handleFavorite = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: id,
          userId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setFavorite(true);
      toast.success("Added to favorites ❤️");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Loading class details...
        </p>
      </div>
    );
  }

  // -----------------------------
  // NOT FOUND UI
  // -----------------------------
  if (!classData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Class Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <Image
            src={classData.image}
            alt={classData.className}
            width={1200}
            height={700}
            className="w-full h-[420px] object-cover rounded-xl"
          />

          <h1 className="text-3xl font-bold mt-6 text-gray-900 dark:text-white">
            {classData.className}
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
            {classData.description}
          </p>

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Info title="Trainer" value={classData.trainerName} />
            <Info title="Category" value={classData.category} />
            <Info title="Duration" value={classData.duration} />
            <Info title="Schedule" value={classData.schedule} />
            <Info title="Difficulty" value={classData.difficulty} />
            <Info title="Bookings" value={classData.bookingCount || 0} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24 h-fit">
          <h2 className="text-4xl font-bold text-green-500">
            ${classData.price}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6">Per Session</p>

          <button
            onClick={handleBookNow}
            disabled={alreadyBooked}
            className={`w-full py-3 rounded-xl font-semibold mb-4 transition ${
              alreadyBooked
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {alreadyBooked ? "Already Booked" : "Book Now"}
          </button>

          <button
            onClick={handleFavorite}
            disabled={favorite}
            className={`w-full py-3 rounded-xl border transition ${
              favorite
                ? "bg-pink-100 border-pink-300 text-pink-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {favorite ? "Saved ❤️" : "Add to Favorites"}
          </button>

        </div>
      </div>
    </div>
  );
}

// -----------------------------
// INFO COMPONENT
// -----------------------------
function Info({ title, value }) {
  return (
    <div className="border dark:border-gray-700 rounded-xl p-4">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
