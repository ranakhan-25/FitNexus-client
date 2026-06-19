"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BookedClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedClasses = async () => {
      try {
        const res = await fetch("/api/dashboard/booked-classes");
        const data = await res.json();
        setClasses(data || []);
      } catch (error) {
        console.log("Error loading booked classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedClasses();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading booked classes...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Booked Classes</h1>
        <p className="text-sm text-gray-500">
          All your successfully booked & paid classes
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-black">
        <table className="w-full text-sm">

          {/* Head */}
          <thead className="bg-gray-100 dark:bg-gray-900 text-left">
            <tr>
              <th className="p-4">Class Name</th>
              <th className="p-4">Trainer Name</th>
              <th className="p-4">Schedule</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No booked classes found
                </td>
              </tr>
            ) : (
              classes.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-4 font-medium">{item.className}</td>
                  <td className="p-4">{item.trainerName}</td>
                  <td className="p-4 text-gray-500">{item.schedule}</td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/dashboard/user/booked-classes/${item._id || item.id}`}
                      className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default BookedClassesPage;