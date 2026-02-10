"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTimer } from "@/contexts/TimerContext";

export default function AuthBanner() {
  const { user } = useAuth();
  const { status } = useTimer();

  if (user || status === "finished") return null;

  return (
    <div className="glass w-full max-w-md rounded-xl border-cyan-500/10 p-4 text-center">
      <p className="mb-1 text-xs text-slate-500">
        Save progress &middot; View statistics &middot; Get recommendations
      </p>
      <Link
        href="/auth"
        className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
      >
        Create a free account &rarr;
      </Link>
    </div>
  );
}
