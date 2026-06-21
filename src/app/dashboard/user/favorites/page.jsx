"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";

export default function FavoritePage() {
  const { data: session } = authClient.useSession();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${session.user.email}`
        );

        const data = await res.json();

        if (data) {
          setFavorites(data.data);
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  
  const handleDelete = async (id) => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setFavorites((prev) =>
          prev.filter((item) => item._id !== id)
        );

        toast.success("Removed from favorites");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Favorite Classes
          </h1>

          <p className="text-gray-500 mt-2">
            Your saved fitness classes
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-4 rounded-2xl">
          <p className="text-pink-100">Total Favorites</p>

          <h2 className="text-3xl font-bold">
            {favorites.length}
          </h2>
        </div>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="mx-auto text-gray-400" size={60} />

          <h3 className="text-xl font-semibold mt-5 dark:text-white">
            No Favorite Classes Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Start exploring classes and save your favorites
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.className}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h2 className="text-xl font-bold dark:text-white">
                  {item.className}
                </h2>

                <p className="text-gray-500">
                  Trainer: {item.trainerName}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/classes/${item.classId}`}
                    className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}