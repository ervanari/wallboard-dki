'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to wallboard page
    router.push('/app/wallboard');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p>Redirecting to wallboard...</p>
      </div>
    </main>
  );
}
