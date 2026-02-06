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
    const saved: SavedSession = {
      id: session.id,
      userId: user.id,
      startTime: session.startTime,
      endTime: session.endTime!,
      totalElapsed: stats.totalElapsed,
      totalBreakTime: stats.totalBreakTime,
      totalDeducted: stats.totalDeducted,
      productiveTime: stats.productiveTime,
    };
    saveSession(saved);
    setSaved(true);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-gray-100">
        Session Summary
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatCard label="Total Time" value={formatMinutes(totalMin)} />
        <StatCard
          label="Productive"
          value={formatMinutes(productiveMin)}
          highlight="emerald"
        />
        <StatCard label="Breaks" value={formatMinutes(breakMin)} highlight="amber" />
        <StatCard
          label="Deducted"
          value={formatMinutes(deductedMin)}
          highlight="rose"
        />
      </div>

      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {efficiency}%
        </div>
        <div className="text-sm text-gray-500">efficiency</div>
      </div>

      {user ? (
        <button
          onClick={handleSave}
          disabled={saved}
          className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700"
        >
          {saved ? "Session Saved!" : "Save Session"}
        </button>
      ) : (
        <div className="rounded-xl bg-indigo-50 p-4 text-center dark:bg-indigo-950/50">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Create an account to save sessions and view statistics.
          </p>
          <Link
            href="/auth"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Sign up for free &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "emerald" | "amber" | "rose";
}) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400",
  };
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${highlight ? colors[highlight] : "text-gray-900 dark:text-gray-100"}`}
      >
        {value}
      </p>
    </div>
  );
}
