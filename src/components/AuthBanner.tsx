"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTimer } from "@/contexts/TimerContext";

export default function AuthBanner() {
  const { user } = useAuth();
  const { status } = useTimer();

  if (user || status === "finished") return null;

  return (
    <div className="w-full max-w-md rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-900 dark:bg-indigo-950/50">
      <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        Want to save your progress and view statistics?
      </p>
      <Link
        href="/auth"
        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
      >
        Create a free account &rarr;
      </Link>
    </div>
  );
}
