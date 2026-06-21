"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Search,
  Eye,
  Loader2,
  Dumbbell,
} from "lucide-react";
import { toast } from "react-toastify";

const BookedClassesPage = () => {
  const { data: session } = authClient.useSession();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${session.user.email}`
        );

        const data = await res.json();

        if (data.success) {
          setClasses(data.data);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [session]);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) =>
      item.className
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, classes]);

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-5">
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Booked Classes
          </h1>

          <p className="text-gray-500 mt-2">
            View all your purchased fitness classes
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl px-6 py-4 min-w-[220px]">
          <p className="text-green-100">
            Total Booked Classes
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {classes.length}
          </h2>
        </div>
      </div>

      {/* Search */}

      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by class name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border dark:border-zinc-700 dark:bg-zinc-800 outline-none"
          />
        </div>
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        {filteredClasses.length === 0 ? (
          <div className="py-20 text-center">
            <Dumbbell
              className="mx-auto text-gray-400"
              size={60}
            />

            <h3 className="text-xl font-semibold mt-5 dark:text-white">
              No Booked Classes Found
            </h3>

            <p className="text-gray-500 mt-2">
              You haven&apos;t enrolled in any class yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-800">
                  <th className="text-left px-6 py-4 font-semibold">
                    Class
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Trainer
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Schedule
                  </th>

                  <th className="text-left px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="text-center px-6 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredClasses.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <h4 className="font-semibold dark:text-white">
                          {item.className}
                        </h4>

                        <p className="text-sm text-gray-500">
                          Fitness Class
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {item.trainerName}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />

                        {item.schedule}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Paid
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <Link
                        href={`/classes/${item.classId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedClassesPage;