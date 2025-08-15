/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_LINKS } from '@/constants/sidebarLinks';
import { useAuth } from "@/context/AuthContext" // or however you access role

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Example: 'admin', 'doctor', 'patient'

  const links = SIDEBAR_LINKS[user?.role] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold capitalize">{user?.role} Panel</h2>
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
    </aside>
  );
}
