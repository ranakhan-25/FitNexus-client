"use client";

import { useEffect, useState } from "react";
import { UserX, Search, Users } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";
import Image from "next/image";

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // fetch trainers
  const fetchTrainers = async () => {
    try {
      const token = await getToken()
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/trainers`, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      setTrainers(data.data || []);
    } catch (err) {
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // demote trainer
  const handleDemote = async (trainerId) => {
    const confirm = window.confirm(
      "Are you sure you want to demote this trainer to user?"
    );

    if (!confirm) return;

    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/trainers/${trainerId}/demote`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Trainer demoted successfully");
        fetchTrainers();
      } else {
        toast.error(data.message || "Failed to demote trainer");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Filter trainers based on search input
  const filteredTrainers = trainers.filter((trainer) =>
    trainer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    trainer?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      
      {/* Header with Search Component */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Trainers</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View registered trainers and manage their roles.
            </p>
          </div>

          <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trainer by name or email..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Overview Stats Card (Extra Added) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Active Trainers</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {trainers.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Trainer</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading trainers data...
                    </div>
                  </td>
                </tr>
              ) : filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                      No Trainers Found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Try adjusting your search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTrainers.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* TRAINER INFO */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Image
                          src={trainer?.image || "/avatar.png"}
                          width={40}
                          height={40}
                          alt={trainer.name || "Trainer"}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="max-w-[180px] lg:max-w-[240px]">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {trainer.name}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/30">
                            Active Trainer
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      <div className="max-w-[220px] truncate">{trainer.email}</div>
                    </td>

                    {/* JOINED DATE */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {new Date(trainer.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDemote(trainer._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-400 rounded-lg transition-colors"
                      >
                        <UserX size={14} />
                        Demote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">No Trainers Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                No matching trainers registered.
              </p>
            </div>
          ) : (
            filteredTrainers.map((trainer) => (
              <div key={trainer._id} className="p-4 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={trainer?.image || "/avatar.png"}
                      width={44}
                      height={44}
                      alt={trainer.name || "Trainer"}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{trainer.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {trainer.email}
                      </p>
                    </div>
                  </div>
                  
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/30 flex-shrink-0">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                  <span className="text-slate-400 dark:text-slate-500">Member Since</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {new Date(trainer.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <button
                  onClick={() => handleDemote(trainer._id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-950/60 dark:text-red-400 rounded-xl transition-colors"
                >
                  <UserX size={16} />
                  Demote to User
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}