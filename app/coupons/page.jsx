"use client";

import { useState, useMemo } from "react";

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Dummy coupons data
  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME10", discount: "10%", expiry: "2025-12-31" },
    { id: 2, code: "SUMMER20", discount: "20%", expiry: "2025-06-30" },
    { id: 3, code: "FESTIVE15", discount: "15%", expiry: "2025-11-15" },
  ]);

  const filteredCoupons = useMemo(() => {
    let filtered = coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(search.toLowerCase()) ||
      coupon.discount.toLowerCase().includes(search.toLowerCase()) ||
      coupon.expiry.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code)
    );
  }, [coupons, search, sortOrder]);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Coupons Management 
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={() =>
              setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Coupon Code
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Discount
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">{coupon.code}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{coupon.discount}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{coupon.expiry}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCoupons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
