"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
        { method: "PATCH" }
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${userId}/make-admin`,
        { method: "PATCH" }
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
    return <p className="p-10 text-gray-400">Loading users...</p>;

  // ================= COUNTS =================
  const blockedCount = users.filter((u) => u.status === "blocked").length;
  const activeCount = users.filter((u) => u.status !== "blocked").length;

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-green-600/20 border border-green-500">
          <h2 className="text-lg font-semibold">Active Users</h2>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-red-600/20 border border-red-500">
          <h2 className="text-lg font-semibold">Blocked Users</h2>
          <p className="text-2xl font-bold">{blockedCount}</p>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border border-white/10 rounded-xl overflow-hidden">

          {/* HEADER */}
          <thead className="bg-white/10 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-3">{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === "admin"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "blocked"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="flex gap-2 p-2">

                  {/* BLOCK / UNBLOCK */}
                  <button
                    onClick={() => toggleBlock(user._id, user.status)}
                    className={`px-3 py-1 rounded text-xs ${
                      user.status === "blocked"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {user.status === "blocked"
                      ? "Unblock"
                      : "Block"}
                  </button>

                  {/* MAKE ADMIN */}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => makeAdmin(user._id)}
                      className="px-3 py-1 rounded text-xs bg-purple-500"
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