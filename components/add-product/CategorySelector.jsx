"use client";

import { useState, useEffect } from "react";

export default function CategorySelector({
  category = "",
  subcategory = "",
  onChange,
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories (handles both array and { success: true, data: [] } responses)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        else setCategories([]);
      } else {
        console.error("Error fetching categories:", data?.message || res.statusText);
        setCategories([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Find selected category by name OR id (supports both forms)
  const selectedCategoryObj =
    categories.find((c) => c._id === category) ||
    categories.find((c) => c.name === category) ||
    null;

  // Called when user picks a category (we pass categoryName and reset subcategory)
  const handleCategoryChange = (categoryId) => {
    const sel = categories.find((c) => c._id === categoryId);
    const catName = sel ? sel.name : "";
    if (typeof onChange === "function") onChange(catName, "");
  };

  // Called when user picks a subcategory (we pass existing category value and new sub)
  const handleSubcategoryChange = (sub) => {
    if (typeof onChange === "function") onChange(
      // pass category as name if available, else as id (parent handles)
      selectedCategoryObj ? selectedCategoryObj.name : category,
      sub
    );
  };

  if (loading) {
    return (
      <div className="p-2">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
      {/* Category select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Category
        </label>
        <select
          value={selectedCategoryObj?._id || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory select (shows only when a category is chosen) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Subcategory
        </label>
        <select
          value={subcategory || ""}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          disabled={!selectedCategoryObj}
        >
          <option value="">{selectedCategoryObj ? "Select Subcategory" : "Select Category first"}</option>
          {selectedCategoryObj?.subcategories?.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
