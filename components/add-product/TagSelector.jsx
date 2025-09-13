"use client";

import { useState, useEffect } from "react";

export default function TagSelector({ selectedTags = [], onChange }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Toggle tag selection
  const toggleTag = (tag) => {
    let updated;
    if (selectedTags.includes(tag.name)) {
      updated = selectedTags.filter((t) => t !== tag.name);
    } else {
      updated = [...selectedTags, tag.name];
    }
    onChange(updated);
  };

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-300 text-sm">Loading tags...</p>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 dark:text-gray-200 font-medium">
        Select Tags
      </label>

      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <button
              key={tag._id}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                selectedTags.includes(tag.name)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tag.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            No tags available
          </p>
        )}
      </div>

      {/* ✅ Show selected tags summary */}
      {selectedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Selected Tags:
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
