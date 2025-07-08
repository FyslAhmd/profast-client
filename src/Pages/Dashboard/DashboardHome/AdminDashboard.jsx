import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  Legend,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function AdminDashboard() {
  const axiosSecure = useAxiosSecure();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/dashboard-stats");
      return res.data;
    },
  });

  const { data: recentRaw, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/recent-activity");
      return res.data;
    },
  });

  const recent = Array.isArray(recentRaw) ? recentRaw : [];

  if (statsLoading || recentLoading)
    return (
      <div className="text-center py-16 text-lg">Loading dashboard...</div>
    );

  // Pie chart data for parcel statuses
  const pieData = [
    { name: "Not Collected", value: stats.notCollected },
    { name: "In Transit", value: stats.inTransit },
    { name: "Delivered", value: stats.delivered },
  ];

  // Bar chart data for counts
  const barData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Parcels", value: stats.totalParcels },
    { name: "Active Riders", value: stats.activeRiders },
    { name: "Pending Riders", value: stats.pendingRiders },
    { name: "Pending Payments", value: stats.pendingPayments },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Parcels" value={stats.totalParcels} />
          <StatCard label="Not Collected" value={stats.notCollected} />
          <StatCard label="In Transit" value={stats.inTransit} />
          <StatCard label="Delivered" value={stats.delivered} />
          <StatCard label="Pending Payments" value={stats.pendingPayments} />
          <StatCard label="Active Riders" value={stats.activeRiders} />
          <StatCard label="Pending Riders" value={stats.pendingRiders} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Bar Chart */}
          <div className="rounded-2xl shadow-md border bg-white p-4">
            <h2 className="font-semibold mb-4 text-lg">Key Metrics</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart */}
          <div className="rounded-2xl shadow-md border bg-white p-4">
            <h2 className="font-semibold mb-4 text-lg">
              Parcel Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={pieColors[idx % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl shadow-md border bg-white p-6">
          <h2 className="font-semibold mb-4 text-lg">Recent Parcels</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-sm uppercase">
                  <th className="py-2 px-4 text-left">Parcel ID</th>
                  <th className="py-2 px-4 text-left">Sender</th>
                  <th className="py-2 px-4 text-left">Receiver</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((parcel) => (
                  <tr key={parcel._id}>
                    <td className="py-2 px-4">{parcel._id}</td>
                    <td className="py-2 px-4">
                      {parcel.sender_name || parcel.created_by}
                    </td>
                    <td className="py-2 px-4">
                      {parcel.receiver_name || "--"}
                    </td>
                    <td className="py-2 px-4">
                      <StatusBadge status={parcel.delivary_status} />
                    </td>
                    <td className="py-2 px-4">
                      {parcel.creation_date
                        ? new Date(parcel.creation_date).toLocaleDateString()
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component for the top cards
function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl shadow-md border bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center p-6">
        <span className="text-3xl font-bold text-blue-700">{value}</span>
        <span className="text-gray-600 mt-2 text-sm">{label}</span>
      </div>
    </div>
  );
}

// StatusBadge for parcel status
function StatusBadge({ status }) {
  let color =
    status === "in_transit"
      ? "bg-blue-200 text-blue-800"
      : status === "delivared"
      ? "bg-green-200 text-green-800"
      : status === "not_collected"
      ? "bg-yellow-200 text-yellow-800"
      : "bg-gray-200 text-gray-800";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status?.replace("_", " ").toUpperCase() || "--"}
    </span>
  );
}
