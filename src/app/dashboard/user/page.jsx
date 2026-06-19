"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/user");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data
      </div>
    );
  }

  const { user, totalBookedClasses, totalFavorites, trainerApplication } =
    data;

  return (
    <div className="p-6 space-y-8">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border bg-white dark:bg-black">
          <p className="text-sm text-muted-foreground">Total Booked Classes</p>
          <h2 className="text-3xl font-bold">{totalBookedClasses}</h2>
        </div>

        <div className="p-5 rounded-xl border bg-white dark:bg-black">
          <p className="text-sm text-muted-foreground">Total Favorites</p>
          <h2 className="text-3xl font-bold">{totalFavorites}</h2>
        </div>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="p-6 rounded-xl border bg-white dark:bg-black flex flex-col md:flex-row items-center gap-5">
        <div>
          {user.image ? (
            <Image
              src={user.image}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
              {user.name?.[0]}
            </div>
          )}
        </div>

        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          {/* Role Badge */}
          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-primary text-white">
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ================= TRAINER STATUS ================= */}
      <div className="p-6 rounded-xl border bg-white dark:bg-black">
        <h3 className="text-lg font-semibold mb-3">
          Trainer Application Status
        </h3>

        {!trainerApplication?.status && (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-400 text-white">
            Not Applied
          </span>
        )}

        {trainerApplication?.status === "pending" && (
          <span className="px-3 py-1 text-sm rounded-full bg-yellow-500 text-black">
            Pending
          </span>
        )}

        {trainerApplication?.status === "approved" && (
          <span className="px-3 py-1 text-sm rounded-full bg-green-500 text-white">
            Approved
          </span>
        )}

        {trainerApplication?.status === "rejected" && (
          <div className="space-y-2">
            <span className="px-3 py-1 text-sm rounded-full bg-red-500 text-white">
              Rejected
            </span>

            {trainerApplication.feedback && (
              <p className="text-sm text-red-500 mt-2">
                Admin Feedback: {trainerApplication.feedback}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;