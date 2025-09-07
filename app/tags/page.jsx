"use client";

import { useState, useMemo } from "react";

export default function TagsPage() {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  const [tags, setTags] = useState([
    { id: 1, name: "New Arrival" },
    { id: 2, name: "Best Seller" },
    { id: 3, name: "Discount" },
    { id: 4, name: "Limited Edition" },
    { id: 5, name: "Trending" },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

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

  const handleAddTag = () => {
    if (!newTag.trim()) {
      setError("Tag name cannot be empty");
      return;
    }

    if (tags.some((t) => t.name.toLowerCase() === newTag.trim().toLowerCase())) {
      setError("Tag already exists");
      return;
    }

    setTags([...tags, { id: Date.now(), name: newTag.trim() }]);
    setNewTag("");
    setShowDialog(false);
    setError("");
  };

  const handleDeleteTag = (id) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      setTags(tags.filter((tag) => tag.id !== id));
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
            {filteredTags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                  {tag.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTags.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
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
