"use client";

import { useState, useMemo, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      } else {
        console.error("Error fetching categories:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data]);
        setNewCategory("");
      } else {
        alert(data.message || "Error adding category");
      }
    } catch (err) {
      console.error("Add category error:", err);
    }
  };

  // ✅ Add new subcategory
  const handleAddSubcategory = async () => {
    if (!selectedCategory || !newSubcategory.trim()) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/categories/${selectedCategory}/add-subcategories`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subcategories: [newSubcategory.trim()] }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCategories(
          categories.map((cat) => (cat._id === data._id ? data : cat))
        );
        setNewSubcategory("");
      } else {
        alert(data.message || "Error adding subcategory");
      }
    } catch (err) {
      console.error("Add subcategory error:", err);
    }
  };

  // ✅ Edit category name
  const handleEditCategory = async (id) => {
    if (!editCategoryName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}/edit-name`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(
          categories.map((cat) => (cat._id === data._id ? data : cat))
        );
        setEditCategoryId(null);
        setEditCategoryName("");
      } else {
        alert(data.message || "Error updating category");
      }
    } catch (err) {
      console.error("Edit category error:", err);
    }
  };

  // ✅ Delete category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(categories.filter((cat) => cat._id !== id));
      } else {
        alert(data.message || "Error deleting category");
      }
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // ✅ Filter + Search + Sort
  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.subcategories?.some((sub) =>
          sub.toLowerCase().includes(search.toLowerCase())
        )
    );

    if (filterCategory !== "All") {
      filtered = filtered.filter((cat) => cat.name === filterCategory);
    }

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [categories, search, filterCategory, sortOrder]);

  const categoryOptions = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Categories & Subcategories
      </h1>

      {/* Search, Filter & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </div>

      {/* Add Subcategory */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        />
        <button
          onClick={handleAddSubcategory}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Add Subcategory
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        {loading ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading categories...
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-200">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-200">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                    {editCategoryId === cat._id ? (
                      <input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {cat.subcategories?.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 mr-2 mb-1 rounded-lg text-xs"
                      >
                        {sub}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {editCategoryId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleEditCategory(cat._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditCategoryId(null);
                            setEditCategoryName("");
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditCategoryId(cat._id);
                            setEditCategoryName(cat.name);
                          }}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No categories found.
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
