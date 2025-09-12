"use client";

import { useState, useEffect, useMemo } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [API_BASE_URL]);

  // Filter + sort
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.products.some((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.orderStatus === statusFilter);
    }

    // Sorting
    if (sortKey === "date") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortKey === "amount") {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, sortKey]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Orders Management
      </h1>

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
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
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
              {[
                "Order ID",
                "Customer",
                "Products",
                "Quantity",
                "Amount",
                "Payment",
                "Status",
                "Date",
                "Actions",
              ].map((title) => (
                <th
                  key={title}
                  className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-300"
                >
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* ✅ show new custom orderId */}
                  <td className="px-6 py-4 font-medium">{order.orderId}</td>

                  <td className="px-6 py-4">{order.customerName}</td>

                  <td className="px-6 py-4">
                    {order.products.map((p) => p.name).join(", ")}
                  </td>

                  <td className="px-6 py-4">{order.totalQuantity}</td>

                  <td className="px-6 py-4 font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-6 py-4">{order.paymentMethod}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold
                        ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-700"
                            : order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-200 dark:text-yellow-700"
                            : order.orderStatus === "Processing"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700"
                            : order.orderStatus === "Shipped"
                            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-200 dark:text-indigo-700"
                            : order.orderStatus === "Returned"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-200 dark:text-purple-700"
                            : "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700"
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      View
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-300"
                >
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
