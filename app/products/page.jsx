"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products
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

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Filter by search
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <a
          href="/products/addproducts"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </a>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full sm:w-64"
        />
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3"
            >
              {/* All Images */}
              <div className="grid grid-cols-3 gap-2">
                {product.images?.length > 0 ? (
                  product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`${product.name}-${idx}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="placeholder"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-sm">
                  {product.category} / {product.subcategory}
                </p>
                <p className="text-sm">Gender: {product.gender}</p>
                <p className="font-medium">
                  Price: ₹{product.price}{" "}
                  {product.discountPrice && (
                    <span className="text-green-600 ml-2">
                      ₹{product.discountPrice} (Discount)
                    </span>
                  )}
                </p>
                <p className="text-sm">
                  Variants:{" "}
                  {product.variants?.map((v) => v.size).join(", ") || "—"}
                </p>
                <p className="text-sm">
                  Tags:{" "}
                  {product.tags?.length ? product.tags.join(", ") : "—"}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    product.isActive ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/products/${product._id}/edit`)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
