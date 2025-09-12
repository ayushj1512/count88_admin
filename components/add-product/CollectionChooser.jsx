"use client";
import { useEffect, useState } from "react";

export default function CollectionChooser({
  selectedCollection = "",
  onChange,
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/collections";
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) {
        setCollections(data);
      } else {
        console.error("Error fetching collections:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-300 text-sm">
        Loading collections...
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 dark:text-gray-200 font-medium">
        Collection
      </label>
      <select
        value={selectedCollection}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
      >
        <option value="">Select Collection</option>
        {collections.map((col) => (
          <option key={col._id} value={col._id}>
            {col.title}
          </option>
        ))}
      </select>
    </div>
  );
}
