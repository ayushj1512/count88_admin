"use client";

import { useState, useMemo, useEffect } from "react";

export default function TagsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch tags from backend
  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/tags`);
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // ✅ Filter + sort logic
  const filteredTags = useMemo(() => {
    let filtered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filterTag !== "All") {
      filtered = filtered.filter((tag) => tag.name === filterTag);
    }

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [tags, search, filterTag, sortOrder]);

  const tagOptions = ["All", ...tags.map((t) => t.name)];

  // ✅ Add tag via API
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      setError("Tag name cannot be empty");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Failed to add tag");
        return;
      }

      await fetchTags();
      setNewTag("");
      setShowDialog(false);
      setError("");
    } catch (err) {
      console.error("Failed to add tag:", err);
      setError("Something went wrong");
    }
  };

  // ✅ Delete tag via API
  const handleDeleteTag = async (id) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/tags/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to delete tag");
        return;
      }

      await fetchTags();
    } catch (err) {
      console.error("Failed to delete tag:", err);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Tags Management
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>

        {/* Add Tag Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Tag
        </button>
      </div>

      {/* Tags Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-200">
                Tag Name
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                >
                  Loading tags...
                </td>
              </tr>
            ) : filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <tr
                  key={tag._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                >
                  No tags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Tag Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 space-y-4 transition-colors">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Add New Tag
            </h2>
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            <input
              type="text"
              placeholder="Tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setError("");
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
