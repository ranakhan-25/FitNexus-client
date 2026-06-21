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
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">
            Overview of platform performance
          </p>
        </div>

        {/* ADMIN PROFILE CARD */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg">

          <Image
            src={user?.image || "/avatar.png"}
            alt="admin"
            width={10}
            height={10}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
          />

          <div>
            <p className="font-semibold">{user?.name}</p>
            <span className="text-xs px-2 py-1 bg-green-500 rounded-full">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* USERS */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-300">Total Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.users}</p>
          <p className="text-sm text-gray-400 mt-1">Registered members</p>
        </div>

        {/* CLASSES */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-300">Total Classes</h2>
          <p className="text-4xl font-bold mt-2">{stats.classes}</p>
          <p className="text-sm text-gray-400 mt-1">Active courses</p>
        </div>

        {/* BOOKINGS */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-300">Booked Classes</h2>
          <p className="text-4xl font-bold mt-2">{stats.bookings}</p>
          <p className="text-sm text-gray-400 mt-1">Total enrollments</p>
        </div>
      </div>

      <AdminAnalytics stats={stats} />
    </div>
  );
};

export default AdminOverviewPage;