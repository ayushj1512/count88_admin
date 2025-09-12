"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch coupons from API
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/coupons`);
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setCoupons(data.data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch coupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete coupon
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`${API_URL}/api/coupons/${id}`, {
        method: "DELETE",
      });
      fetchCoupons();
    } catch (error) {
      console.error("❌ Error deleting coupon:", error);
    }
  };

  // ✅ Filter + sort coupons
  const filteredCoupons = useMemo(() => {
    if (!Array.isArray(coupons)) return [];

    let filtered = coupons.filter(
      (coupon) =>
        coupon.code?.toLowerCase().includes(search.toLowerCase()) ||
        coupon.discountType?.toLowerCase().includes(search.toLowerCase()) ||
        String(coupon.discountValue).includes(search)
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
        🎟️ Coupons Management
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
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>

        <button
          onClick={() => router.push("/coupons/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {loading ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-300">
            ⏳ Loading coupons...
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Code</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Discount</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Max Discount
                </th>
                <th className="px-6 py-3 text-left font-semibold">Expiry</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountType}</td>
                  <td className="px-6 py-4">{coupon.discountValue}</td>
                  <td className="px-6 py-4">
                    {coupon.discountType === "PERCENTAGE" && coupon.maxDiscount
                      ? coupon.maxDiscount
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
