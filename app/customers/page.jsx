"use client";

import { useState, useMemo } from "react";

export default function CustomersPage() {
  // Dummy customers data
  const [customers] = useState([
    {
      id: 1,
      name: "Ayush Juneja",
      email: "ayush@example.com",
      phone: "9876543210",
      totalOrders: 12,
      totalSpent: 125000,
      status: "Active",
      registered: "2025-01-15",
    },
    {
      id: 2,
      name: "Simran Kaur",
      email: "simran@example.com",
      phone: "9123456780",
      totalOrders: 5,
      totalSpent: 49999,
      status: "Inactive",
      registered: "2025-03-05",
    },
    {
      id: 3,
      name: "Rohit Sharma",
      email: "rohit@example.com",
      phone: "9988776655",
      totalOrders: 8,
      totalSpent: 74999,
      status: "Active",
      registered: "2025-02-20",
    },
    {
      id: 4,
      name: "Priya Singh",
      email: "priya@example.com",
      phone: "9871234560",
      totalOrders: 3,
      totalSpent: 29999,
      status: "Active",
      registered: "2025-05-10",
    },
    {
      id: 5,
      name: "Aman Verma",
      email: "aman@example.com",
      phone: "9123450000",
      totalOrders: 7,
      totalSpent: 89999,
      status: "Inactive",
      registered: "2025-04-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("");

  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Sorting
    if (sortKey === "orders") {
      filtered = filtered.sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (sortKey === "spent") {
      filtered = filtered.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortKey === "registered") {
      filtered = filtered.sort(
        (a, b) => new Date(b.registered) - new Date(a.registered)
      );
    }

    return filtered;
  }, [customers, searchTerm, statusFilter, sortKey]);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Customers Management 
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full md:w-1/3
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="">Sort By</option>
          <option value="orders">Total Orders</option>
          <option value="spent">Total Spent</option>
          <option value="registered">Registered Date</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Email
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Phone
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Total Orders
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Registered
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{customer.name}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{customer.email}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{customer.totalOrders}</td>
                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">₹{customer.totalSpent}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{customer.registered}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Disable
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
