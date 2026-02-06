"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSavedSessions } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import StatsView from "@/components/StatsView";
import Recommendations from "@/components/Recommendations";
import Link from "next/link";

export default function StatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const sessions = useMemo(
    () => (user ? getSavedSessions(user.id) : []),
    [user]
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to view your statistics.
          </p>
          <Link
            href="/auth"
            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-600"
          >
            Sign In
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your Statistics
        </h1>
        <Recommendations sessions={sessions} />
        <StatsView sessions={sessions} />
      </main>
    </div>
  );
}
