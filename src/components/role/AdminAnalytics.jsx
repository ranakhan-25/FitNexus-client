"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#a855f7", "#22c55e"];

// ================= MAIN COMPONENT =================
export default function AdminAnalytics({ stats }) {
  // Bar Data
  const barData = [
    { name: "Users", value: stats.users },
    { name: "Classes", value: stats.classes },
    { name: "Bookings", value: stats.bookings },
  ];

  // Pie Data
  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Classes", value: stats.classes },
    { name: "Bookings", value: stats.bookings },
  ];

  // Fake trend (better UX for dashboard)
  const lineData = [
    { name: "Day 1", users: 10, classes: 5, bookings: 8 },
    { name: "Day 2", users: 20, classes: 8, bookings: 12 },
    { name: "Day 3", users: 35, classes: 15, bookings: 20 },
    { name: "Day 4", users: 50, classes: 22, bookings: 28 },
    { name: "Day 5", users: stats.users, classes: stats.classes, bookings: stats.bookings },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

      {/* BAR CHART */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LINE CHART */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Growth Trend</h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="users" stroke="#3b82f6" />
            <Line type="monotone" dataKey="classes" stroke="#a855f7" />
            <Line type="monotone" dataKey="bookings" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}