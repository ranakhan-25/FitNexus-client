"use client";

import { useEffect, useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const TrainerOverview = () => {
  const { data: session } = authClient.useSession();
  const trainerId = session?.user?.id;
  const user = session?.user;
  
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    students: [],
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/trainer/overview?trainerId=${trainerId}`,
        );

        const data = await res.json();

        if (data.success) {
          setStats({
            totalClasses: data.totalClasses || 0,
            totalStudents: data.totalStudents || 0,
            students: data.students || [],
            loading: false,
          });
        } else {
          setStats((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.log(error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    if (trainerId) fetchStats();
  }, [trainerId]);

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className="rounded-2xl p-6 border bg-white dark:bg-gray-900 dark:border-gray-800 shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          {stats.loading ? (
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2" />
          ) : (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </h2>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${gradient}`}
        >
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trainer Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your classes and enrolled students
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="🏋️"
          gradient="bg-red-500"
        />

        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="👥"
          gradient="bg-orange-500"
        />
      </div>

      {/* 👇 STUDENT LIST SECTION */}
      <div className="max-w-6xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Enrolled Students
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 text-left">Student Email</th>
                <th className="p-3 text-left">Class ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Booked Date</th>
              </tr>
            </thead>

            <tbody>
              {stats.loading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : stats.students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No students enrolled yet
                  </td>
                </tr>
              ) : (
                stats.students.map((s, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    <td className="p-3 text-gray-900 dark:text-white">
                      {s.userEmail || "N/A"}
                    </td>

                    <td className="p-3 text-gray-500 dark:text-gray-400">
                      {s.classId}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                        Enrolled
                      </span>
                    </td>

                    <td className="p-3 text-gray-500 dark:text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainerOverview;
