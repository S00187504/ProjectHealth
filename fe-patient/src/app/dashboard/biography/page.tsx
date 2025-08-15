'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BiographyPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'patient') {
      router.push('/dashboard');
    }
  }, [user?.role]);

  if (user?.role !== 'patient') return null;

  return (
    <div>
      <h1 className="text-xl font-bold">Update Biography</h1>
      <p>Visible to Patients only.</p>
    </div>
  );
}
