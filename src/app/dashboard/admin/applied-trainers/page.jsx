"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { toast } from "react-toastify";
import TrainerDetailsModal from "@/components/role/TrainerDetailsModal";
import { getToken } from "@/components/service/getToken";
import Image from "next/image";

export default function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/trainer-applications`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/trainer-applications/${applicationId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Trainer approved");

        setApplications((prev) =>
          prev.filter((item) => item._id !== applicationId),
        );

        setSelectedTrainer(null);
      }
    } catch (error) {
      toast.error("Failed to approve trainer");
    }
  };

  const handleReject = async (applicationId, feedback) => {
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/trainer-applications/${applicationId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Application rejected");

        setApplications((prev) =>
          prev.filter((item) => item._id !== applicationId),
        );

        setSelectedTrainer(null);
      }
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(
      (item) =>
        item?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item?.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [applications, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Applied Trainers
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review trainer applications and manage approvals.
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
              placeholder="Search trainer..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Pending Applications
          </p>
          <h2 className="text-3xl font-bold mt-2 tracking-tight text-slate-900 dark:text-white">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Today's Applications
          </p>
          <h2 className="text-3xl font-bold mt-2 tracking-tight text-slate-900 dark:text-white">
            {
              applications.filter(
                (item) =>
                  new Date(item.createdAt).toDateString() ===
                  new Date().toDateString(),
              ).length
            }
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Requests
          </p>
          <h2 className="text-3xl font-bold mt-2 tracking-tight text-slate-900 dark:text-white">
            {applications.length}
          </h2>
        </div>
      </div>

      {/* Main Table / Cards Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Trainer</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Applied Date</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                      No Applications Found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      No pending trainer applications available.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* TRAINER */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Image
                          src={trainer?.image || "/avatar.png"}
                          width={40}
                          height={40}
                          alt={trainer.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="max-w-[180px] md:max-w-[220px]">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {trainer?.name}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Trainer Applicant
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      <div className="max-w-[200px] truncate">
                        {trainer?.email}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {new Date(trainer?.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30">
                        Pending
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedTrainer(trainer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-400 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                        Details
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
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                No Applications Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                No pending trainer applications available.
              </p>
            </div>
          ) : (
            filteredApplications.map((trainer) => (
              <div
                key={trainer._id}
                className="p-4 bg-white dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={trainer?.profileImage || "/avatar.png"}
                      width={44}
                      height={44}
                      alt={trainer.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {trainer?.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {trainer?.email}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30 flex-shrink-0">
                    Pending
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800/50 text-xs">
                  <span className="text-slate-400 dark:text-slate-500">
                    Applied on
                  </span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {new Date(trainer?.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedTrainer && (
        <TrainerDetailsModal
          trainer={selectedTrainer}
          close={() => setSelectedTrainer(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
