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
      <div className="flex min-h-screen items-center justify-center bg-grid">
        <p className="text-sm text-slate-500">{"// loading..."}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-grid">
        <div className="scan-line pointer-events-none" />
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-sm text-slate-500">
            {"// authentication required"}
          </p>
          <Link
            href="/auth"
            className="btn-glow rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-6 py-3 text-sm font-bold tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/25"
          >
            SIGN IN
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-grid">
      <div
        className="pointer-events-none absolute right-1/4 top-1/4 h-96 w-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="scan-line pointer-events-none" />

      <Navbar />
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <h1 className="text-gradient-cyan text-2xl font-bold uppercase tracking-wider">
          Statistics
        </h1>
        <Recommendations sessions={sessions} />
        <StatsView sessions={sessions} />
      </main>
    </div>
  );
}
