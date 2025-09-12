"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiLayers,
  FiTag,
  FiGift,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <FiMenu /> },
  { href: "/products", label: "Products", icon: <FiBox /> },
  { href: "/orders", label: "Orders", icon: <FiShoppingCart /> },
  { href: "/customers", label: "Customers", icon: <FiUsers /> },
  { href: "/categories", label: "Categories", icon: <FiLayers /> },
  { href: "/tags", label: "Tags", icon: <FiTag /> },
  { href: "/coupons", label: "Coupons", icon: <FiGift /> },
  { href: "/collections", label: "Collections", icon: <FiGrid /> }, // ✅ Added
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Only run window/localStorage related code on client
  useEffect(() => {
    setMounted(true);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    if (!mounted) return; // prevent SSR issues
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Logout handler
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  // Render nothing until mounted to avoid SSR errors
  if (!mounted) return null;

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-md shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-full z-40 transform ${
                open ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300`
            : "h-screen"
        } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col p-4 transition-all duration-300 ${
          open ? "w-64" : "w-20"
        } shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {open && (
            <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
          )}
          {!isMobile && (
            <button
              onClick={() => setOpen(!open)}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {open ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-blue-600 text-white dark:bg-blue-500 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition text-sm"
        >
          <FiLogOut />
          {open && <span>Logout</span>}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="mt-2 px-2 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition text-sm text-gray-800 dark:text-gray-200"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
          {open && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </button>
      </aside>
    </>
  );
}
