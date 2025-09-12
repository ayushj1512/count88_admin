"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE]);

  // ✅ Filter & sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        (p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase())) &&
        (categoryFilter === "All" || p.category === categoryFilter) &&
        (statusFilter === "All" ||
          (p.isActive ? "Active" : "Inactive") === statusFilter)
    );

    if (sortField) {
      filtered.sort((a, b) => {
        if (sortField === "price" || sortField === "stock") {
          return sortOrder === "asc"
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        } else {
          return sortOrder === "asc"
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        }
      });
    }
    return filtered;
  }, [products, search, categoryFilter, statusFilter, sortField, sortOrder]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const statuses = ["All", "Active", "Inactive"];

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 py-10">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Products Management
        </h1>
        <Link href="/products/addproducts">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search by name, brand or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="brand">Brand</option>
          <option value="price">Price</option>
        </select>

        {sortField && (
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            {sortOrder === "asc" ? "Asc ⬆️" : "Desc ⬇️"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "Image",
                "Name",
                "Brand",
                "Category",
                "Variants",
                "Tags",
                "Status",
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
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={
                      product.images?.[0]?.url || "https://via.placeholder.com/60"
                    }
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {product.brand}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {product.category}
                  {product.subcategory && ` / ${product.subcategory}`}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {product.variants?.map((v) => v.size).join(", ") || "—"}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {product.tags?.length > 0 ? product.tags.join(", ") : "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      product.isActive
                        ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-700"
                        : "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center px-6 py-4 text-gray-500 dark:text-gray-300"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
