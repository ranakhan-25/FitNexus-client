"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const AllClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();

  const user = session?.user;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;


  const fetchClasses = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes?${params}`,
      );

      const data = await res.json();

      if (data.success) {
        setClasses(data.classes);
        setTotalPages(data.totalPages);
      } else {
        setClasses([]);
      }
    } catch (error) {
      // console.log("Frontend error:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH WHEN PAGE/FILTER CHANGE
  // =========================
  useEffect(() => {
    fetchClasses();
  }, [page, category, search]);

  // =========================
  // SEARCH DEBOUNCE
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* HERO */}
      <section className="relative overflow-hidden pt-24 bg-gradient-to-br from-emerald-50 via-green-100 to-lime-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black transition-colors">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-lime-300/30 dark:bg-lime-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
      bg-white/70 dark:bg-white/10 backdrop-blur-md 
      border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 mb-6"
          >
            🏋️ Premium Fitness Platform
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl font-extrabold leading-tight 
      text-gray-900 dark:text-white"
          >
            Explore{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Elite
            </span>{" "}
            Fitness Classes
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base md:text-lg">
            Discover professional trainer-led workouts, structured programs, and
            community-driven fitness experiences designed to transform your body
            and lifestyle.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto text-sm">
            <div className="rounded-xl py-3 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200">
              50+ Classes
            </div>

            <div className="rounded-xl py-3 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200">
              Certified Trainers
            </div>

            <div className="rounded-xl py-3 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200">
              Active Community
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border dark:border-zinc-800 p-5 mb-10 shadow-sm mt-10">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* SEARCH */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="text"
                  placeholder="Search classes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              {/* CATEGORY */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              >
                <option value="">All Categories</option>

                <option value="Yoga">Yoga</option>

                <option value="Cardio">Cardio</option>

                <option value="Strength">Strength</option>

                <option value="CrossFit">CrossFit</option>

                <option value="Zumba">Zumba</option>

                <option value="HIIT">HIIT</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* FILTER SECTION */}

        {/* LOADING */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && classes.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold">No Classes Found</h2>

            <p className="text-zinc-500 mt-3">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* CLASSES GRID */}
        {!loading && classes.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all"
                >
                  <Image
                    src={item.image}
                    alt={item.className}
                    width={500}
                    height={300}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.category}
                      </span>

                      <span className="font-bold text-green-600">
                        ${item.price}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                      {item.className}
                    </h2>

                    <p className="text-zinc-500 mt-3 text-sm line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-5 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Trainer:</span>{" "}
                        {item.trainerName}
                      </p>

                      <p>
                        <span className="font-semibold">Duration:</span>{" "}
                        {item.duration}
                      </p>

                      <p>
                        <span className="font-semibold">Schedule:</span>{" "}
                        {item.schedule}
                      </p>

                      <p>
                        <span className="font-semibold">Bookings:</span>{" "}
                        {item.bookingCount || 0}
                      </p>
                    </div>

                    {user ? (
                      <Link
                        href={`/classes/${item._id}`}
                        className="block mt-6 text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
                      >
                        View Details
                      </Link>
                    ) : (
                      <Link
                        href={`/unauthorized`}
                        className="block mt-6 text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({
                  length: totalPages,
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`w-10 h-10 rounded-xl ${
                      page === index + 1 ? "bg-green-500 text-white" : "border"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllClassesPage;
