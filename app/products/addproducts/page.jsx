"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TagSelector from "@/components/add-product/TagSelector";
import CollectionChooser from "@/components/add-product/CollectionChooser";
import CategorySelector from "@/components/add-product/CategorySelector";
import SizeSelector from "@/components/add-product/SizeSelector";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    groupId: "",
    name: "",
    brand: "",
    description: "", // 🔹 added field
    category: "Footwear",
    subcategory: "",
    gender: "Men",
    collection: "",
    price: "",
    discountPrice: "",
    tags: [],
    isActive: true,
  });

  const [selectedSizes, setSelectedSizes] = useState([
    "UK 3",
    "UK 4",
    "UK 5",
    "UK 6",
    "UK 7",
    "UK 8",
    "UK 9",
  ]);

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const need = ["groupId", "name", "brand", "category", "gender", "price"];
    for (let f of need) {
      if (!form[f]) {
        setLoading(false);
        return setError(`${f} is required`);
      }
    }
    if (!selectedSizes.length) {
      setLoading(false);
      return setError("At least one size required");
    }
    if (!images.length) {
      setLoading(false);
      return setError("At least one image required");
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v)
      );
      fd.append(
        "variants",
        JSON.stringify(selectedSizes.map((s) => ({ size: s })))
      );
      images.forEach((img) => fd.append("images", img));

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to save");
      await res.json();

      alert("✅ Product saved!");
      router.push("/products");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add Footwear</h1>
      <form
        onSubmit={submit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        {error && <p className="text-red-500">{error}</p>}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["groupId", "Group ID"],
            ["name", "Product Name"],
            ["brand", "Brand"],
            ["price", "Price"],
            ["discountPrice", "Discount Price"],
          ].map(([f, label]) => (
            <div key={f}>
              <label className={lbl}>{label}</label>
              <input
                name={f}
                type={f.toLowerCase().includes("price") ? "number" : "text"}
                value={form[f]}
                onChange={handle}
                className={inp}
              />
            </div>
          ))}

          {/* Gender dropdown */}
          <div>
            <label className={lbl}>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handle}
              className={inp}
            >
              {["Men", "Women", "Unisex", "Kids"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔹 Description */}
        <div>
          <label className={lbl}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handle}
            rows={4}
            className={inp}
            placeholder="Enter product description..."
          />
        </div>

        {/* Category Selector */}
        <CategorySelector
          category={form.category}
          subcategory={form.subcategory}
          onChange={(cat, sub) =>
            setForm((prev) => ({ ...prev, category: cat, subcategory: sub }))
          }
        />

        {/* Collection Chooser */}
        <CollectionChooser
          selectedCollection={form.collection}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, collection: value }))
          }
        />

        {/* Tag Selector */}
        <TagSelector
          selectedTags={form.tags}
          onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
        />

        {/* Size Selector */}
        <SizeSelector
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
        />

        {/* Images */}
        <div>
          <h2 className="font-semibold mb-2">Product Images</h2>
          <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded"
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handle}
          />
          Active
        </label>

        {/* Submit */}
        <button
          type="submit"
          className={`${btnPri} flex items-center justify-center gap-2`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </form>
    </div>
  );
}

/* Tailwind styles */
const inp = "border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white";
const lbl = "block text-sm font-medium mb-1";
const btnBase = "px-3 py-2 rounded text-sm font-medium";
const btnPri =
  btnBase +
  " bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed";
