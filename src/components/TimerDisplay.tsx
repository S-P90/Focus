"use client";

import { useTimer } from "@/contexts/TimerContext";
import { formatTime, calcBreakTime } from "@/lib/utils";

export default function TimerDisplay() {
  const { session, status, elapsed } = useTimer();

  const breakSeconds = session
    ? Math.floor(calcBreakTime(session.breaks) / 1000)
    : 0;
  const activeSeconds = Math.max(0, elapsed - breakSeconds);
  const displaySeconds =
    status === "break"
      ? breakSeconds
      : status === "idle"
        ? 0
        : activeSeconds;

  const currentSecond = displaySeconds % 60;

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const ringProgress = currentSecond / 60;
  const strokeDashoffset = circumference * (1 - ringProgress);

  const ringColor: Record<string, string> = {
    idle: "#22d3ee",
    running: "#34d399",
    break: "#fbbf24",
    finished: "#a78bfa",
  };

  const statusLabel: Record<string, string> = {
    idle: "// awaiting_input",
    running: "// focused",
    break: "// break_mode",
    finished: "// session_end",
  };

  const labelColor: Record<string, string> = {
    idle: "text-cyan-400/60",
    running: "text-emerald-400",
    break: "text-amber-400",
    finished: "text-violet-400",
  };

  const isActive = status === "running" || status === "break";

  return (
    <div className="relative flex flex-col items-center gap-3">
      <div
        className="clock-ring relative flex items-center justify-center"
        style={{ width: 320, height: 320 }}
      >
        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isMajor = i % 5 === 0;
          const isActiveTick = isActive && i <= currentSecond;
          return (
            <div
              key={i}
              className={`tick-mark${isMajor ? " major" : ""}${isActiveTick ? " active" : ""}`}
              style={{ transform: `rotate(${i * 6}deg)` }}
            />
          );
        })}

        {/* Background ring */}
        <svg
          width="320"
          height="320"
          className={`absolute${status === "idle" ? " spin-slow" : ""}`}
        >
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke={ringColor[status]}
            strokeWidth="2"
            strokeOpacity="0.1"
          />
        </svg>

        {/* Progress ring */}
        <svg
          width="320"
          height="320"
          className="absolute"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke={ringColor[status]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              status === "idle" ? circumference : strokeDashoffset
            }
            className="transition-all duration-300"
            style={{
              filter: `drop-shadow(0 0 6px ${ringColor[status]})`,
            }}
          />
        </svg>

        {/* Inner glow pulse */}
        {isActive && (
          <div
            className="pulse-glow absolute rounded-full"
            style={{
              width: 240,
              height: 240,
              background: `radial-gradient(circle, ${ringColor[status]}08 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Time display */}
        <div className="absolute flex flex-col items-center gap-1">
          <span
            className={`text-xs font-medium uppercase tracking-[0.3em] ${labelColor[status]}`}
          >
            {statusLabel[status]}
          </span>
          <div
            className="font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-7xl"
            style={{ color: ringColor[status] }}
          >
            {formatTime(displaySeconds)}
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <div
                className="tick-pulse h-2 w-2 rounded-full"
                style={{
                  backgroundColor: ringColor[status],
                  boxShadow: `0 0 8px ${ringColor[status]}`,
                }}
              />
              <span className="text-xs text-slate-500">
                {status === "break"
                  ? `active: ${formatTime(activeSeconds)}`
                  : "tracking"}
              </span>
            </div>
          )}
          {status === "running" &&
            session &&
            session.deductions.length > 0 && (
              <span className="mt-1 text-xs text-rose-400/80">
                [ -
                {session.deductions.reduce((s, d) => s + d.minutes, 0)}m
                deducted ]
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
