"use client";

import { useState, useMemo } from "react";

export default function OrdersPage() {
  // Dummy orders data
  const [orders] = useState([
    { id: 1024, customer: "Ayush", product: "iPhone 15", quantity: 1, status: "Completed", amount: 79999, date: "2025-09-05" },
    { id: 1025, customer: "Simran", product: "Nike Air Max", quantity: 2, status: "Pending", amount: 19998, date: "2025-09-06" },
    { id: 1026, customer: "Rohit", product: "Sony Headphones", quantity: 1, status: "Cancelled", amount: 4499, date: "2025-09-04" },
    { id: 1027, customer: "Priya", product: "Men’s Jacket", quantity: 1, status: "Completed", amount: 2999, date: "2025-09-03" },
    { id: 1028, customer: "Aman", product: "MacBook Pro", quantity: 1, status: "Pending", amount: 159999, date: "2025-09-02" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("");

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Sorting
    if (sortKey === "date") {
      filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortKey === "amount") {
      filtered = filtered.sort((a, b) => b.amount - a.amount);
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, sortKey]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Orders Management </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <input
          type="text"
          placeholder="Search by customer or product..."
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full md:w-1/3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          <option value="">Sort By</option>
          <option value="date">Date (Newest)</option>
          <option value="amount">Amount (High → Low)</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["Order ID","Customer","Product","Quantity","Amount","Status","Date","Actions"].map((title) => (
                <th key={title} className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4 font-semibold">₹{order.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-200 dark:text-yellow-700"
                        : "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">View</button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Cancel</button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center px-6 py-4 text-gray-500 dark:text-gray-300">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
