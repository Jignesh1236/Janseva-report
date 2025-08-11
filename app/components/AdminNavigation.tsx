
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Analytics", href: "/admin/analytics", icon: "📊" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
    { name: "Reports", href: "/reports/view", icon: "📋" },
    { name: "Home", href: "/", icon: "🏡" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
