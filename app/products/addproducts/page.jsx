"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    image: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, category, price, stock, image } = formData;

    if (!name || !category || !price || !stock || !image) {
      setError("Please fill all the fields");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setError("Price must be a valid positive number");
      return;
    }

    if (isNaN(stock) || Number(stock) < 0) {
      setError("Stock must be a valid number (0 or more)");
      return;
    }

    // Dummy submit
    alert(`Product "${name}" added successfully!`);

    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active",
      image: "",
    });

    setError("");

    // Redirect to /products
    router.push("/products");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-4 transition-colors"
      >
        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
          <input
            type="text"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          >
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
