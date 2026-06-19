"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
  if (!user?.id) return;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainer/dashboard/my-classes/${user.id}`
      );

      const json = await res.json();

      setClasses(json?.data || []);
    } catch (error) {
      setClasses([]);
    }
  };

  fetchData();
}, [user?.id]);

  

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        My Classes
      </h1>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">

          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => (
              <tr
                key={cls._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3">{cls.className}</td>
                <td className="p-3">{cls.category}</td>
                <td className="p-3">${cls.price}</td>

                <td className="p-3 flex gap-2 flex-wrap">

                  {/* UPDATE */}
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Update
                  </button>

                  {/* DELETE */}
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                  {/* VIEW STUDENTS */}
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Students
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      

    </div>
  );
}