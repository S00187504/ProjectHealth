// src/app/dashboard/page.tsx
'use client';

import { useAuth } from "@/context/AuthContext"; // or however you access role
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth(); // assume it returns 'admin', 'doctor', or 'patient'
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard/admin-overview');
    } else if (user?.role === 'doctor') {
      router.push('/dashboard/doctor-overview');
    } else if (user?.role === 'patient') {
      router.push('/dashboard/patient-overview');
    }
  }, [user?.role]);

  return (
    <div className="text-center py-10">
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
