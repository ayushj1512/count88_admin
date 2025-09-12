"use client";
import { useEffect, useState } from "react";
import { Trash2, Edit, RefreshCcw, Search } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Use base URL from .env
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_URL = `${API_BASE}/api/collections`;

  // Fetch all collections
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setCollections(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Handle search + sort
  useEffect(() => {
    let data = [...collections];

    if (search.trim()) {
      data = data.filter((col) =>
        col.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "az") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "za") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFiltered(data);
  }, [search, sort, collections]);

  // Add or Update collection
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/${editingId}/edit-name`
        : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      setTitle("");
      setEditingId(null);
      fetchCollections();
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  // Delete collection
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  // Toggle active/inactive
  const handleToggleStatus = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/toggle-status`, { method: "PATCH" });
      fetchCollections();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Edit collection
  const handleEdit = (col) => {
    setTitle(col.title);
    setEditingId(col._id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">📦 Manage Collections</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCollections}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200 transition"
          >
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "✏️ Edit Collection" : "➕ Add Collection"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 w-full"
        >
          <input
            type="text"
            placeholder="Enter collection title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              onClick={() => {
                setTitle("");
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
        >
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="az">Sort by Title (A-Z)</option>
          <option value="za">Sort by Title (Z-A)</option>
        </select>
      </div>

      {/* Collections Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Loading collections...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 italic">
                  No collections found.
                </td>
              </tr>
            ) : (
              filtered.map((col) => (
                <tr
                  key={col._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{col.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        col.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {col.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(col.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(col._id)}
                      className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 transition"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleEdit(col)}
                      className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 transition flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(col._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
