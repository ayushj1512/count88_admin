"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("");

  // ✅ Fetch customers from backend (via /api/orders)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch customers");

      const data = await res.json();

      // 🧾 Transform orders → customers summary
      const customerMap = {};
      data.forEach((order) => {
        const {
          customerName,
          customerEmail,
          customerMobile,
          totalAmount,
          createdAt,
        } = order;

        if (!customerMap[customerEmail]) {
          customerMap[customerEmail] = {
            id: customerEmail,
            name: customerName,
            email: customerEmail,
            phone: customerMobile,
            totalOrders: 0,
            totalSpent: 0,
            status: "Active", // default
            registered: new Date(createdAt).toISOString().split("T")[0],
          };
        }
        customerMap[customerEmail].totalOrders += 1;
        customerMap[customerEmail].totalSpent += totalAmount;
      });

      setCustomers(Object.values(customerMap));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Filter + sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

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

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((c) => ({
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        "Total Orders": c.totalOrders,
        "Total Spent": c.totalSpent,
        Status: c.status,
        Registered: c.registered,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers.xlsx");
  };

  // ✅ Export to CSV
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCustomers.map((c) => ({
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        "Total Orders": c.totalOrders,
        "Total Spent": c.totalSpent,
        Status: c.status,
        Registered: c.registered,
      }))
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Customers Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
          >
            📊 Export Excel
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            📑 Export CSV
          </button>
        </div>
      </div>

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
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Phone</th>
              <th className="px-6 py-3 text-left font-semibold">Total Orders</th>
              <th className="px-6 py-3 text-left font-semibold">Total Spent</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">{customer.name}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-semibold">
                    ₹{customer.totalSpent}
                  </td>
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
                  <td className="px-6 py-4">{customer.registered}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
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
