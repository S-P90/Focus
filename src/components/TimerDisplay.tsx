"use client";

import { useTimer } from "@/contexts/TimerContext";
import { formatTime, calcBreakTime } from "@/lib/utils";

export default function TimerDisplay() {
  const { session, status, elapsed } = useTimer();

  const statusLabel: Record<string, string> = {
    idle: "Ready to focus",
    running: "Focused",
    break: "On break",
    finished: "Session complete",
  };

  const statusColor: Record<string, string> = {
    idle: "text-gray-400 dark:text-gray-500",
    running: "text-emerald-500",
    break: "text-amber-500",
    finished: "text-indigo-500",
  };

  const breakSeconds = session
    ? Math.floor(calcBreakTime(session.breaks) / 1000)
    : 0;
  const activeSeconds = Math.max(0, elapsed - breakSeconds);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className={`text-sm font-semibold uppercase tracking-widest ${statusColor[status]}`}>
        {statusLabel[status]}
      </p>
      <div className="font-mono text-7xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100 sm:text-8xl">
        {status === "break"
          ? formatTime(breakSeconds)
          : formatTime(status === "idle" ? 0 : activeSeconds)}
      </div>
      {status === "break" && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Active time: {formatTime(activeSeconds)}
        </p>
      )}
      {status === "running" && session && session.deductions.length > 0 && (
        <p className="text-sm text-rose-500">
          -{session.deductions.reduce((s, d) => s + d.minutes, 0)}m deducted
        </p>
      )}
    </div>
  );
}
