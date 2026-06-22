"use client";

import { getToken } from "@/components/service/getToken";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken()
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`, {
            headers: {
              authorization: `Bearer ${token}`,
            }
          }
        );
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setUsers(data.users);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlock = async (userId, status) => {
    const url =
      status === "blocked"
        ? `/api/admin/users/${userId}/unblock`
        : `/api/admin/users/${userId}/block`;

    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
        { method: "PATCH",headers:{authorization: `Bearer ${token}`,} }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                status: status === "blocked" ? "active" : "blocked",
              }
            : u
        )
      );

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const makeAdmin = async (userId) => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${userId}/make-admin`,
        { method: "PATCH",headers:{authorization: `Bearer ${token}`,} }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: "admin" } : u
        )
      );

      toast.success("User promoted to admin");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return <p className="p-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 min-h-screen">Loading users...</p>;

  // ================= COUNTS =================
  const blockedCount = users.filter((u) => u.status === "blocked").length;
  const activeCount = users.filter((u) => u.status !== "blocked").length;

  return (
    <div className="p-6 text-gray-900 dark:text-white min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Users</h1>

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Active Users Card */}
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-600/20 border border-green-200 dark:border-green-500 shadow-sm">
          <h2 className="text-sm font-medium text-green-800 dark:text-green-300">Active Users</h2>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{activeCount}</p>
        </div>

        {/* Blocked Users Card */}
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-600/20 border border-red-200 dark:border-red-500 shadow-sm">
          <h2 className="text-sm font-medium text-red-800 dark:text-red-300">Blocked Users</h2>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{blockedCount}</p>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-white/10">
        <table className="w-full text-left border-collapse bg-white dark:bg-transparent">

          {/* HEADER */}
          <thead className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-semibold">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                <td className="p-3 text-gray-900 dark:text-gray-100">{user.name}</td>
                <td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td>

                {/* ROLE BADGE */}
                <td className="p-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium text-white ${
                      user.role === "admin"
                        ? "bg-green-600 dark:bg-green-500"
                        : "bg-gray-500 dark:bg-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* STATUS BADGE */}
                <td className="p-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium text-white ${
                      user.status === "blocked"
                        ? "bg-red-600 dark:bg-red-500"
                        : "bg-blue-600 dark:bg-blue-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* ACTIONS BUTTONS */}
                <td className="p-3 flex gap-2">
                  {/* BLOCK / UNBLOCK */}
                  <button
                    onClick={() => toggleBlock(user._id, user.status)}
                    className={`px-3 py-1 rounded text-xs font-medium text-white transition shadow-sm ${
                      user.status === "blocked"
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    }`}
                  >
                    {user.status === "blocked" ? "Unblock" : "Block"}
                  </button>

                  {/* MAKE ADMIN */}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => makeAdmin(user._id)}
                      className="px-3 py-1 rounded text-xs font-medium bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition shadow-sm"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ManageUsersPage;