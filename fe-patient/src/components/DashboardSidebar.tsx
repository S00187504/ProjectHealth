/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_LINKS } from '@/constants/sidebarLinks';
import { useAuth } from "@/context/AuthContext" // or however you access role

export default function DashboardSidebar() {
  // Role icons
  const roleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <span title="Admin" className="ml-2 text-yellow-400">★</span>;
      case 'doctor':
        return <span title="Doctor" className="ml-2 text-green-400">🩺</span>;
      case 'patient':
        return <span title="Patient" className="ml-2 text-blue-400">👤</span>;
      default:
        return <span title="User" className="ml-2 text-gray-400">👥</span>;
    }
  };
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = SIDEBAR_LINKS[user?.role] || [];
  // Helper to get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold capitalize mb-4">{user?.role} Panel</h2>
        <nav className="space-y-2">
          {links.map((link:any) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                pathname === link.href ? 'bg-gray-700' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-700 pt-6 mt-8 flex items-center gap-3">
        <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-700 text-white font-bold text-lg">
          {getInitials(user?.name)}
        </span>
        <div>
          <div className="font-semibold">{user?.name}</div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={logout}
              className="text-xs bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700 border-none"
            >
              Logout
            </button>
            {roleIcon(user?.role)}
          </div>
        </div>
      </div>
    </aside>
  );
}
