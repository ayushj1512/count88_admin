"use client";
import { useState } from "react";

export default function Variants({ selectedSizes, setSelectedSizes }) {
  // UK Sizes list
  const sizes = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9"];

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      // remove size if already selected
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      // add size if not selected
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Available Sizes
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={`px-3 py-1 rounded-lg border text-sm transition ${
              selectedSizes.includes(size)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-400"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
