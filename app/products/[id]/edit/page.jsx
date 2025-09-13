"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, value) => {
    const newVariants = [...product.variants];
    newVariants[index].size = value;
    setProduct((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { size: "" }],
    }));
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...product,
    variants: JSON.stringify(product.variants || []),
    tags: JSON.stringify(product.tags || []),
  };

  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed");
    alert("✅ Product updated successfully!");
    router.push("/products");
  } catch (err) {
    console.error(err);
    alert("❌ Update failed");
  }
};


  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={product.category || ""}
                readOnly
                className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={product.subcategory || ""}
                readOnly
                className="w-full border px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={product.gender || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Price
              </label>
              <input
                type="number"
                name="discountPrice"
                value={product.discountPrice || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Variants</h2>
          {product.variants?.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-2 mb-2 border p-2 rounded"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Size</label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="mt-5 bg-red-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
          >
            + Add Variant
          </button>
        </div>

        {/* Tags */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Tags</h2>
          <label className="block text-sm font-medium mb-1">
            Comma-separated Tags
          </label>
          <input
            type="text"
            name="tags"
            value={product.tags?.join(", ") || ""}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((t) => t.trim()),
              }))
            }
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Images */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Image-${idx}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Status</h2>
          <label className="block text-sm font-medium mb-1">
            Active / Inactive
          </label>
          <select
            name="isActive"
            value={product.isActive ? "true" : "false"}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Save */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
