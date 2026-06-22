"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Search, Layers } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";

export default function ManageClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  // fetch classes
  const fetchClasses = async () => {
    try {
      const token = await getToken()
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/classes`, {
          headers:{ authorization: `Bearer ${token}`,}
        }
      );
      const data = await res.json();
      setClasses(data.data || []);
    } catch (error) {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // update status (approve/reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/classes/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(`Class ${status} successfully`);
        fetchClasses();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // delete class
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this class?",
    );
    if (!confirm) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/classes/${id}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Class deleted successfully");
        fetchClasses();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Live filter search logic
  const filteredClasses = classes.filter(
    (cls) =>
      cls?.className?.toLowerCase().includes(search.toLowerCase()) ||
      cls?.trainerName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header with Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Manage Classes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Approve, reject, or remove schedules and routines.
            </p>
          </div>

          <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search class or trainer..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Listed Classes
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {classes.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Class details</th>
                <th className="py-4 px-6">Trainer</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-slate-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading classes schedule...
                    </div>
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                      No Classes Found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      No matching lists available.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr
                    key={cls._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Class Details */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {cls.className}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {cls.duration} mins session
                      </p>
                    </td>

                    {/* Trainer Name */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {cls.trainerName}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-medium">
                        {cls.category}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      {cls.status === "Approved" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border border-emerald-200/30">
                          Approved
                        </span>
                      ) : cls.status === "Rejected" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border border-rose-200/30">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400 border border-amber-200/30">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions Buttons */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Approve Button */}
                        <button
                          disabled={cls.status === "Approved"} 
                          onClick={() =>
                            handleStatusUpdate(cls._id, "Approved")
                          }
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Approve Class"
                        >
                          <Check size={18} />
                        </button>

                        {/* Reject Button */}
                        <button
                          disabled={cls.status === "Rejected"} 
                          onClick={() =>
                            handleStatusUpdate(cls._id, "Rejected")
                          }
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Reject Class"
                        >
                          <X size={18} />
                        </button>

                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
              Loading...
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                No Classes Found
              </h3>
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="p-4 bg-white dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {cls.className}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Trainer:{" "}
                      <span className="font-medium">{cls.trainerName}</span>
                    </p>
                  </div>
                  {cls.status === "approved" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/30">
                      Approved
                    </span>
                  ) : cls.status === "rejected" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/30">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/30">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-xs border-t border-slate-50 dark:border-slate-800/60 pt-2 text-slate-500">
                  <span>
                    Category: <b>{cls.category}</b>
                  </span>
                  <span>
                    Duration: <b>{cls.duration} m</b>
                  </span>
                </div>

                {/* Mobile Actions Button Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    disabled={cls.status === "approved"}
                    onClick={() => handleStatusUpdate(cls._id, "approved")}
                    className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg transition-all disabled:opacity-40"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    disabled={cls.status === "rejected"}
                    onClick={() => handleStatusUpdate(cls._id, "rejected")}
                    className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-lg transition-all disabled:opacity-40"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="flex items-center justify-center gap-1 py-1.5 text-xs font-medium bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-400 rounded-lg transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
