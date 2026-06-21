"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Heart,
  BadgeCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const UserOverview = () => {
  const { data: session } = authClient.useSession();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/dashboard-stats/${session.user.email}`
        );

        const result = await res.json();

        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-green-500" />
      </div>
    );
  }

  const user = session?.user;
  const trainerApplication = data?.trainerApplication;

  return (
    <div className="space-y-8 p-5">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats */}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100">
                Total Booked Classes
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {data?.totalBookedClasses || 0}
              </h2>
            </div>

            <Calendar size={60} />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-pink-100">
                Total Favorites
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {data?.totalFavorites || 0}
              </h2>
            </div>

            <Heart size={60} />
          </div>
        </div>
      </div>

      {/* Profile + Status */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Image
              src={user?.image || "/user.png"}
              alt={user?.name || "image"}
              width={120}
              height={120}
              className="rounded-full border-4 border-green-500 object-cover"
            />

            <div className="space-y-2">
              <h2 className="text-2xl font-bold dark:text-white">
                {user?.name}
              </h2>

              <p className="text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>

              <div className="flex gap-2 flex-wrap">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-2">
                  <BadgeCheck size={16} />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer Status */}

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-5">
            Trainer Application
          </h3>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              trainerApplication?.status === "approved"
                ? "bg-green-100 text-green-700"
                : trainerApplication?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trainerApplication?.status || "Not Applied"}
          </span>

          {trainerApplication?.status === "rejected" && (
            <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex gap-3">
                <AlertTriangle className="text-red-500 shrink-0" />

                <div>
                  <h4 className="font-semibold text-red-600">
                    Admin Feedback
                  </h4>

                  <p className="text-sm mt-1 text-red-500">
                    {trainerApplication?.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-8 dark:text-white">
          Fitness Progress
        </h2>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium dark:text-gray-300">
                Goal Completion
              </span>

              <span className="text-green-500 font-bold">
                75%
              </span>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full">
              <div className="h-full bg-green-500 rounded-full w-[75%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium dark:text-gray-300">
                Monthly Activity
              </span>

              <span className="text-blue-500 font-bold">
                60%
              </span>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full">
              <div className="h-full bg-blue-500 rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;