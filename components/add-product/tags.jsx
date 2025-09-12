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
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
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
              onClick={() => toggleTag(tag.name)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                selectedTags.includes(tag.name)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
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
    </div>
  );
}
