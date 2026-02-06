"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400"
        >
          Focus
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/stats"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                Statistics
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.name}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
