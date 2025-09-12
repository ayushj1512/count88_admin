"use client";

import { useEffect, useState } from "react";
import {
  Tag,
  TicketPercent,
  LayoutGrid,
  Package,
  ShoppingBag,
  ShoppingCart,
  Loader2,
} from "lucide-react";

export default function DashboardStats() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [stats, setStats] = useState({
    tags: 0,
    coupons: 0,
    categories: 0,
    collections: 0,
    orders: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch stats dynamically
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        tagsRes,
        couponsRes,
        categoriesRes,
        collectionsRes,
        ordersRes,
        productsRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/api/tags`),
        fetch(`${API_BASE}/api/coupons`),
        fetch(`${API_BASE}/api/categories`),
        fetch(`${API_BASE}/api/collections`),
        fetch(`${API_BASE}/api/orders`),
        fetch(`${API_BASE}/api/products`),
      ]);

      const [
        tagsData,
        couponsData,
        categoriesData,
        collectionsData,
        ordersData,
        productsData,
      ] = await Promise.all([
        tagsRes.json(),
        couponsRes.json(),
        categoriesRes.json(),
        collectionsRes.json(),
        ordersRes.json(),
        productsRes.json(),
      ]);

      setStats({
        tags: tagsData.length || 0,
        coupons: couponsData.length || 0,
        categories: categoriesData.length || 0,
        collections: collectionsData.length || 0,
        orders: ordersData.length || 0,
        products: productsData.length || 0,
      });
    } catch (error) {
      console.error("❌ Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Tags",
      value: stats.tags,
      color: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      icon: <Tag className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Coupons",
      value: stats.coupons,
      color: "text-green-600",
      iconBg: "bg-green-100 dark:bg-green-900",
      icon: <TicketPercent className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Categories",
      value: stats.categories,
      color: "text-yellow-600",
      iconBg: "bg-yellow-100 dark:bg-yellow-900",
      icon: <LayoutGrid className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: "Collections",
      value: stats.collections,
      color: "text-red-600",
      iconBg: "bg-red-100 dark:bg-red-900",
      icon: <Package className="w-6 h-6 text-red-600" />,
    },
    {
      title: "Orders",
      value: stats.orders,
      color: "text-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Products",
      value: stats.products,
      color: "text-pink-600",
      iconBg: "bg-pink-100 dark:bg-pink-900",
      icon: <ShoppingBag className="w-6 h-6 text-pink-600" />,
    },
  ];

  return (
    <div className="pb-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-[200px]">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-300" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading stats...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-5 flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </h2>
                <p
                  className={`text-3xl font-bold ${card.color} leading-tight`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl flex items-center justify-center ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
