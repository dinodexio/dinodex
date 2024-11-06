'use client';
// app/not-found.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  // Redirect to the homepage after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-6xl font-bold text-red-600">404</h1>
      <p className="mb-8 text-xl text-gray-800">
        Oops! The page you're looking for does not exist.
      </p>
      <p className="text-sm text-gray-500">Redirecting to the homepage...</p>
    </div>
  );
}
