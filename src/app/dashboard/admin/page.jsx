"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";
import AdminAnalytics from "@/components/role/AdminAnalytics";

const AdminOverviewPage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH STATS =================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/overview`
        );

        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setStats(data.stats);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 bg-gray-50 dark:bg-gray-950">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white p-6 pb-10 transition-colors duration-300">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of platform performance
          </p>
        </div>

        {/* ADMIN PROFILE CARD */}
       
        <div className="flex items-center gap-4 bg-white dark:bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 shadow-md dark:shadow-lg">
          <Image
            src={user?.image || "/avatar.png"}
            alt="admin"
            width={48} 
            height={48}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
          />

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <span className="text-xs px-2 py-0.5 font-medium bg-green-500 text-white rounded-full">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* USERS CARD */}
        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-gradient-to-br dark:from-blue-600/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-500/30 shadow-md dark:shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-600  font-medium">Total Users</h2>
          <p className="text-4xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.users}</p>
          <p className="text-sm text-gray-500  mt-1">Registered members</p>
        </div>

        {/* CLASSES CARD */}
        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-gradient-to-br dark:from-purple-600/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-500/30 shadow-md dark:shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-600  font-medium">Total Classes</h2>
          <p className="text-4xl font-bold mt-2 text-purple-600 dark:text-purple-400">{stats.classes}</p>
          <p className="text-sm text-gray-500  mt-1">Active courses</p>
        </div>

        {/* BOOKINGS CARD */}
        <div className="p-6 rounded-2xl bg-green-50 dark:bg-gradient-to-br dark:from-green-600/20 dark:to-green-900/20 border border-green-200 dark:border-green-500/30 shadow-md dark:shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-600  font-medium">Booked Classes</h2>
          <p className="text-4xl font-bold mt-2 text-green-600 dark:text-green-400">{stats.bookings}</p>
          <p className="text-sm text-gray-500 ">Total enrollments</p>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="mt-8">
        <AdminAnalytics stats={stats} />
      </div>
    </div>
  );
};

export default AdminOverviewPage;