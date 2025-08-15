// src/app/dashboard/layout.tsx
import DashboardSidebar from '@/components/DashboardSidebar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
