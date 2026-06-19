"use client";

import { useEffect, useState } from "react";

const FavoriteClassesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/dashboard/favorites");
        const data = await res.json();
        setFavorites(data || []);
      } catch (error) {
        console.log("Failed to load favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Remove favorite
  const handleRemove = async (id) => {
    const confirmDelete = confirm("Remove from favorites?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/dashboard/favorites/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setFavorites((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading favorite classes...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Favorite Classes</h1>
        <p className="text-sm text-gray-500">
          Manage your saved fitness classes
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="p-6 text-center w-full text-gray-500 border rounded-xl">
          No favorite classes found
        </div>
      ) : (
        <div className="grid gap-4">

          {favorites.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl bg-white dark:bg-black"
            >

              {/* Left Content */}
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                  {item.className}
                </h2>
                <p className="text-sm text-gray-500">
                  Trainer: {item.trainerName}
                </p>
                <p className="text-xs text-gray-400">
                  Schedule: {item.schedule}
                </p>
              </div>

              {/* Actions */}
              <div>
                <button
                  onClick={() => handleRemove(item._id)}
                  disabled={deletingId === item._id}
                  className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingId === item._id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default FavoriteClassesPage;