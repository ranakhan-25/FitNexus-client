"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";

const ClassDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [booked, setBooked] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // FETCH CLASS DETAILS
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/${id}`,
        );

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Class not found");
        }

        setClassData(data.data);
      } catch (error) {
        toast.error(error.message || "Failed to load class");
        setClassData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClass();
  }, [id]);

  // BOOK CLASS
  const handleBookNow = () => {
    if (booked) {
      toast.error("You have already booked this class");
      return;
    }

    router.push(`/payment/${id}`);
  };

  // ADD FAVORITE
  const handleFavorite = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            classId: id,
            userId: user?.id,
            userEmail: user?.email,
            className: classData?.className,
            image: classData?.image,
            price: classData?.price,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add favorite");
      }

      setFavorite(true);
      toast.success("Added to favorites!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // REMOVE FAVORITE
  const handleUnFavorite = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to remove favorite");
      }

      setFavorite(false);
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(error.message || "Error removing favorite");
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading class details...
      </div>
    );
  }

  // NOT FOUND UI
  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Class not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* TOP CARD */}
      <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl overflow-hidden">
        {/* IMAGE */}
        <div className="relative h-80 md:h-full">
          <Image
            src={classData.image}
            alt={classData.className}
            fill
            className="object-cover"
          />
        </div>

        {/* INFO */}
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">{classData.className}</h1>

          <p className="text-gray-500">{classData.description}</p>

          <div className="text-sm space-y-2">
            <p>
              <b>Schedule:</b> {classData.schedule}
            </p>
            <p>
              <b>Duration:</b> {classData.duration}
            </p>
            <p>
              <b>Category:</b> {classData.category}
            </p>
            <p>
              <b>Price:</b> ${classData.price}
            </p>
            <p>
              <b>Trainer:</b> {classData.trainerName}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            {/* BOOK */}
            <button
              onClick={handleBookNow}
              disabled={booked}
              className={`px-5 py-3 rounded-xl font-semibold ${
                booked
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {booked ? "Already Booked" : "Book Now"}
            </button>

            {/* FAVORITE */}
            {!favorite ? (
              <button
                onClick={handleFavorite}
                className="px-5 py-3 rounded-xl border border-green-500 text-green-500"
              >
                Add to Favorites ❤️
              </button>
            ) : (
              <button
                onClick={handleUnFavorite}
                className="px-5 py-3 rounded-xl border border-red-500 text-red-500"
              >
                Remove Favorite
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXTRA */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-2xl">
          <h3 className="font-bold">🔥 High Intensity</h3>
          <p className="text-sm text-gray-500">Push your limits safely</p>
        </div>

        <div className="p-5 border rounded-2xl">
          <h3 className="font-bold">🏋️ Expert Trainer</h3>
          <p className="text-sm text-gray-500">Certified professionals</p>
        </div>

        <div className="p-5 border rounded-2xl">
          <h3 className="font-bold">📈 Progress Tracking</h3>
          <p className="text-sm text-gray-500">Track your fitness growth</p>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsPage;
