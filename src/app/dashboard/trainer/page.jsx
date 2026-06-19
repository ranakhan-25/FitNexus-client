"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const TrainerDashboard = () => {
  const { data: session } = authClient.useSession();
  const trainerId = session?.user?.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!trainerId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainer/dashboard/${trainerId}`
        );

        const result = await res.json();
        setData(result?.data || null);
      } catch (err) {
        console.log(err);
        setData(null);
      }
    };

    fetchData();
  }, [trainerId]);

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  const { trainer, totalClasses, totalStudents, classes = [] } = data;

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Classes</p>
          <h2 className="text-2xl font-bold">{totalClasses}</h2>
        </div>

        <div className="p-5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Students</p>
          <h2 className="text-2xl font-bold">{totalStudents}</h2>
        </div>

        <div className="p-5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Forum Posts</p>
          <h2 className="text-2xl font-bold">3</h2>
        </div>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

        <div className="flex items-center gap-4">
          <Image
            src={trainer?.image || "/avatar.png"}
            alt="trainer"
            width={70}
            height={70}
            className="rounded-full border border-gray-300 dark:border-gray-600"
          />

          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              {trainer?.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {trainer?.email}
            </p>

            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              Trainer
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/trainer/add-class"
            className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Add New Class
          </Link>

          <Link
            href="/dashboard/trainer/my-classes"
            className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            My Classes
          </Link>

          <Link
            href="/dashboard/trainer/add-forum-post"
            className="px-3 py-1.5 text-sm rounded bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Forum Post
          </Link>
        </div>
      </div>

      {/* ================= RECENT CLASSES ================= */}
      <div className="space-y-3">

        <h2 className="text-lg font-semibold">Recent Classes</h2>

        {classes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No classes found
          </p>
        ) : (
          classes.slice(0, 4).map((cls) => (
            <div
              key={cls._id}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={cls.image}
                  alt=""
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />

                <div>
                  <h3 className="font-semibold">{cls.className}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cls.category} • {cls.difficulty}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  ${cls.price}
                </p>

                <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                  {cls.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;