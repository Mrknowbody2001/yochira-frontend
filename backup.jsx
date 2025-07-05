// src/pages/Dashboard.jsx
import React from "react";
import SidebarMenu from "../components/SidebarMenu";
import { HiUserCircle } from "react-icons/hi";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <SidebarMenu />
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="text-xl font-bold text-blue-600">MyCompany Logo</div>
          <HiUserCircle className="text-3xl text-gray-700" />
        </header>

        {/* Content */}
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <p>Welcome to your dashboard. Use the sidebar to navigate.</p>
        </main>
      </div>
    </div>
  );
}
