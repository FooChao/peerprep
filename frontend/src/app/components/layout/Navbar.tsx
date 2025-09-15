/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude 3.5 Sonnet), date: 2025-09-15
 * Purpose: To create a reusable navigation bar component for the PeerPrep application.
 * Author Review: I validated correctness, security, and performance of the code.
 *  I modified the styling to match the application's theme.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { removeToken } from "@/services/userServiceCookies";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { user, setUser } = useUser();

  const navItems = [
    { name: "Dashboard", href: "/home" },
    { name: "Find Partner", href: "/match" },
  ];

  const handleLogout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-blue-600 font-bold text-xl">
            <span className="text-2xl">👥</span> PeerPrep
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveTab(item.name)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.name
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            {user && (
              <span className="text-sm font-medium text-gray-700">
                {user.username}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}