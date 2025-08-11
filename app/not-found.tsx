"use client";
import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-200"
        >
          Return Home
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Redirecting to home page in 5 seconds...
        </p>
      </div>
    </div>
  );
} 