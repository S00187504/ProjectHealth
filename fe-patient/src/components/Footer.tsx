'use client';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 p-6">
      <div className="container mx-auto text-center">
        <p
          className="text-gray-600 dark:text-gray-400"
          suppressHydrationWarning
        >
          © {year ?? ''} Practice. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
