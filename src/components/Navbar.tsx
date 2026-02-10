"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-cyan-500/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* Clock icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-cyan-400"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <line
              x1="12"
              y1="12"
              x2="12"
              y2="7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="12"
              x2="16"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-gradient-cyan text-lg font-bold tracking-wider">
            FOCUS
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/stats"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
              >
                Statistics
              </Link>
              <span className="text-xs text-cyan-400/60">{user.name}</span>
              <button
                onClick={signOut}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-cyan-500/30 hover:text-cyan-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
