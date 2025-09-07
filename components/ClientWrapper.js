"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/", "/login"];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  // Theme state
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    else localStorage.setItem("theme", "light");
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  const layoutContent = (
    <div className="relative h-full w-full">
      {/* Theme toggle button */}


      {children}
    </div>
  );

  if (showSidebar) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto transition-colors">
          {layoutContent}
        </main>
      </div>
    );
  }

  return layoutContent;
}
