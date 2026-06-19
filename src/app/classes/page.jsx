"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AllClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // 🚀 MAIN FETCH
  const fetchClasses = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
      });

      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const res = await fetch(
        `${BASE_URL}/api/classes?${params.toString()}`
      );

      const data = await res.json();

      setClasses(data.classes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Fetch error:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 AUTO FETCH (BEST PRACTICE)
  useEffect(() => {
    fetchClasses();
  }, [page, category]);

  // 🚀 DEBOUNCED SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchClasses();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* HERO */}
      <section className="rounded-3xl bg-gradient-to-r from-green-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-16 px-6 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Explore Fitness Classes
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover professional trainer-led fitness programs designed for all levels
        </p>
      </section>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-700 rounded-xl px-4 py-3 w-full md:w-[400px] outline-none bg-white dark:bg-gray-800"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border dark:border-gray-700 rounded-xl px-4 py-3 md:w-60 bg-white dark:bg-gray-800"
        >
          <option value="">All Categories</option>
          <option value="Yoga">Yoga</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Zumba">Zumba</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-pulse text-lg">Loading classes...</div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && classes.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No Classes Found</h2>
          <p className="text-gray-500">Try changing search or category</p>
        </div>
      )}

      {/* GRID */}
      {!loading && classes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <div
              key={item._id}
              className="border dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition bg-white dark:bg-gray-900"
            >
              <Image
                src={item.image}
                alt={item.className}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                    {item.category}
                  </span>

                  <span className="font-bold text-green-600">
                    ${item.price}
                  </span>
                </div>

                <h2 className="text-xl font-bold">{item.className}</h2>

                <p className="text-sm text-gray-500 mt-2 mb-4">
                  {item.description?.slice(0, 90)}...
                </p>

                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <p><b>Trainer:</b> {item.trainerName}</p>
                  <p><b>Duration:</b> {item.duration}</p>
                  <p><b>Schedule:</b> {item.schedule}</p>
                </div>

                <Link
                  href={`/classes/${item._id}`}
                  className="block mt-4 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                page === i + 1 ? "bg-green-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllClassesPage;