"use client";

import { useState, useMemo } from "react";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", subcategories: ["Mobiles", "Laptops", "Headphones", "Cameras"] },
    { id: 2, name: "Fashion", subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"] },
    { id: 3, name: "Home & Kitchen", subcategories: ["Furniture", "Home Decor", "Kitchen Appliances"] },
    { id: 4, name: "Sports & Fitness", subcategories: ["Gym Equipment", "Sportswear", "Accessories"] },
    { id: 5, name: "Books", subcategories: ["Fiction", "Non-Fiction", "Educational", "Comics"] },
  ]);

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.subcategories.some((sub) => sub.toLowerCase().includes(search.toLowerCase()))
    );

    if (filterCategory !== "All") {
      filtered = filtered.filter((cat) => cat.name === filterCategory);
    }

    return filtered.sort((a, b) =>
      sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [categories, search, filterCategory, sortOrder]);

  const categoryOptions = ["All", ...categories.map(c => c.name)];

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory.trim(), subcategories: [] }]);
    setNewCategory("");
  };

  // Add new subcategory
  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategory.trim()) return;
    setCategories(categories.map(cat =>
      cat.name === selectedCategory
        ? { ...cat, subcategories: [...cat.subcategories, newSubcategory.trim()] }
        : cat
    ));
    setNewSubcategory("");
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Categories & Subcategories</h1>

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
          {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button
          onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
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
          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
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
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Category</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-200">Subcategories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredCategories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{cat.name}</td>
                <td className="px-6 py-4">
                  {cat.subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 mr-2 mb-1 rounded-lg text-xs"
                    >
                      {sub}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
