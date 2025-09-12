"use client";

import { useState } from "react";

export default function AddCouponPage() {
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE", // PERCENTAGE | FLAT
    discountValue: "",
    maxDiscount: "",
    expiryDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        expiryDate: new Date(form.expiryDate),
        isActive: form.isActive,
      };

      // only send maxDiscount if it's a percentage type and has value
      if (form.discountType === "PERCENTAGE" && form.maxDiscount) {
        payload.maxDiscount = Number(form.maxDiscount);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setMessage({ type: "success", text: "Coupon added successfully!" });
        setForm({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          maxDiscount: "",
          expiryDate: "",
          isActive: true,
        });
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.message || "Failed to add coupon" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        ➕ Add Coupon
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4 max-w-2xl"
      >
        <input
          type="text"
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="FLAT">Flat</option>
        </select>

        <input
          type="number"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        {form.discountType === "PERCENTAGE" && (
          <input
            type="number"
            placeholder="Max Discount (₹)"
            value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
        )}

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
        >
          {loading ? "Saving..." : "Save Coupon"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
