"use client";

import { useTimer } from "@/contexts/TimerContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatMinutes } from "@/lib/utils";
import { saveSession } from "@/lib/storage";
import { SavedSession } from "@/lib/types";
import { useState, useRef } from "react";
import Link from "next/link";

export default function SessionSummary() {
  const { session, status, getStats } = useTimer();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const lastSessionIdRef = useRef<string | undefined>(undefined);

  const stats = getStats();

  if (session?.id !== lastSessionIdRef.current) {
    lastSessionIdRef.current = session?.id;
    if (saved) setSaved(false);
  }

  if (status !== "finished" || !session || !stats) return null;

  const toMin = (ms: number) => ms / 60000;
  const totalMin = toMin(stats.totalElapsed);
  const breakMin = toMin(stats.totalBreakTime);
  const deductedMin = toMin(stats.totalDeducted);
  const productiveMin = toMin(stats.productiveTime);
  const efficiency =
    totalMin > 0 ? Math.round((productiveMin / totalMin) * 100) : 0;

  const handleSave = () => {
    if (!user || !session) return;
    const data: SavedSession = {
      id: session.id,
      userId: user.id,
      startTime: session.startTime,
      endTime: session.endTime!,
      totalElapsed: stats.totalElapsed,
      totalBreakTime: stats.totalBreakTime,
      totalDeducted: stats.totalDeducted,
      productiveTime: stats.productiveTime,
    };
    saveSession(data);
    setSaved(true);
  };

  return (
    <div className="glass w-full max-w-md rounded-2xl p-6">
      <h2 className="text-gradient-cyan mb-4 text-center text-sm font-bold uppercase tracking-wider">
        {"// session_report"}
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatCard label="TOTAL" value={formatMinutes(totalMin)} />
        <StatCard
          label="PRODUCTIVE"
          value={formatMinutes(productiveMin)}
          color="emerald"
        />
        <StatCard
          label="BREAKS"
          value={formatMinutes(breakMin)}
          color="amber"
        />
        <StatCard
          label="DEDUCTED"
          value={formatMinutes(deductedMin)}
          color="rose"
        />
      </div>

      {/* Efficiency ring */}
      <div className="mb-4 flex flex-col items-center gap-1">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg width="80" height="80" className="absolute">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(167,139,250,0.1)"
              strokeWidth="3"
            />
          </svg>
          <svg
            width="80"
            height="80"
            className="absolute"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - efficiency / 100)}
              style={{ filter: "drop-shadow(0 0 4px rgba(167,139,250,0.5))" }}
            />
          </svg>
          <span className="text-lg font-bold text-violet-400">
            {efficiency}%
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          efficiency
        </span>
      </div>

      {user ? (
        <button
          onClick={handleSave}
          disabled={saved}
          className="btn-glow w-full rounded-xl border border-cyan-500/40 bg-cyan-500/15 py-3 text-xs font-bold tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/25 disabled:border-slate-700 disabled:bg-slate-800/50 disabled:text-slate-500"
        >
          {saved ? "SESSION SAVED" : "SAVE SESSION"}
        </button>
      ) : (
        <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-center">
          <p className="mb-2 text-xs text-slate-500">
            {"// create account to save sessions & view stats"}
          </p>
          <Link
            href="/auth"
            className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Sign up free &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "emerald" | "amber" | "rose";
}) {
  const borderColors = {
    emerald: "border-emerald-500/20",
    amber: "border-amber-500/20",
    rose: "border-rose-500/20",
  };
  const textColors = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };
  return (
    <div
      className={`rounded-xl border bg-slate-900/50 p-3 text-center ${
        color ? borderColors[color] : "border-slate-700/50"
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          color ? textColors[color] : "text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
