"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Users,
  Activity,
  ShoppingBag,
  CreditCard,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);

      // Optional: listen to changes in dark mode
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => setIsDark(e.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4000 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 },
  ];

  const ordersData = [
    { name: "Completed", value: 400 },
    { name: "Pending", value: 200 },
    { name: "Cancelled", value: 100 },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Welcome back, Admin <CheckCircle className="text-white" />
        </h1>
        <p className="text-sm text-gray-200 mt-2">
          Here’s an overview of your store’s performance today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Approved Orders",
            value: "1,245",
            icon: <CheckCircle className="text-green-500 w-6 h-6" />,
            bg: "bg-green-50 dark:bg-green-900",
          },
          {
            title: "Total Orders",
            value: "2,350",
            icon: <ShoppingCart className="text-blue-500 w-6 h-6" />,
            bg: "bg-blue-50 dark:bg-blue-900",
          },
          {
            title: "Month Total",
            value: "₹85,000",
            icon: <DollarSign className="text-yellow-500 w-6 h-6" />,
            bg: "bg-yellow-50 dark:bg-yellow-900",
          },
          {
            title: "Total Revenue",
            value: "₹12,40,000",
            icon: <DollarSign className="text-indigo-500 w-6 h-6" />,
            bg: "bg-indigo-50 dark:bg-indigo-900",
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between ${card.bg} p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h2>
              {card.icon}
            </div>
            <p className="text-2xl font-bold mt-3">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sales Graph */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#4b5563" : "#e5e7eb"}
            />
            <XAxis dataKey="month" stroke={isDark ? "#d1d5db" : "#6b7280"} />
            <YAxis stroke={isDark ? "#d1d5db" : "#6b7280"} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users + Customer Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="text-blue-500 w-5 h-5" /> Users
          </h2>
          <ul className="space-y-3">
            {[
              { name: "Ayush", role: "Admin" },
              { name: "Rohit", role: "Customer" },
              { name: "Simran", role: "Customer" },
            ].map((user, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <span>{user.name}</span>
                <span className="text-gray-600 dark:text-gray-300">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Orders Pie */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-4">Customer Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              {["Order ID", "Customer", "Amount", "Status"].map((th, idx) => (
                <th key={idx} className="p-3">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#1024", customer: "Simran", amount: "₹1,500", status: "Completed", icon: <CheckCircle className="inline text-green-600 dark:text-green-400 w-4 h-4" /> },
              { id: "#1025", customer: "Rohit", amount: "₹800", status: "Pending", icon: <ShoppingBag className="inline text-yellow-600 dark:text-yellow-400 w-4 h-4" /> },
              { id: "#1026", customer: "Aman", amount: "₹2,200", status: "Cancelled", icon: <XCircle className="inline text-red-600 dark:text-red-400 w-4 h-4" /> },
            ].map((order, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3 font-semibold flex items-center gap-2">{order.icon} {order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overall Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-indigo-500 w-5 h-5" /> Overall Activity
        </h2>
        <ul className="space-y-3">
          {[
            { icon: <CheckCircle className="text-green-500 w-4 h-4" />, text: "Order #1024 approved" },
            { icon: <ShoppingCart className="text-blue-500 w-4 h-4" />, text: "New order placed by Simran" },
            { icon: <CreditCard className="text-yellow-500 w-4 h-4" />, text: "Payment received from Rohit" },
            { icon: <XCircle className="text-red-500 w-4 h-4" />, text: "Order #1005 cancelled" },
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition p-2 rounded">
              {item.icon} {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
