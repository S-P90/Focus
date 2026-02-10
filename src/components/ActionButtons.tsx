"use client";

import { useState } from "react";
import { useTimer } from "@/contexts/TimerContext";

export default function ActionButtons() {
  const {
    status,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    deductTime,
    reset,
  } = useTimer();
  const [showDeduct, setShowDeduct] = useState(false);
  const [deductMinutes, setDeductMinutes] = useState("");

  const handleDeduct = () => {
    const mins = parseInt(deductMinutes, 10);
    if (mins > 0) {
      deductTime(mins);
      setDeductMinutes("");
      setShowDeduct(false);
    }
  };

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={clockIn}
          className="btn-glow rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-14 py-5 text-xl font-bold tracking-wider text-emerald-400 transition-all hover:bg-emerald-500/25 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] active:scale-95"
        >
          CLOCK IN
        </button>
        <span className="text-xs text-slate-600">
          press to start tracking
        </span>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={reset}
          className="btn-glow rounded-2xl border border-violet-500/40 bg-violet-500/15 px-14 py-5 text-xl font-bold tracking-wider text-violet-400 transition-all hover:bg-violet-500/25 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] active:scale-95"
        >
          NEW SESSION
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-3">
        {status === "running" ? (
          <button
            onClick={startBreak}
            className="btn-glow rounded-xl border border-amber-500/40 bg-amber-500/15 px-8 py-4 text-lg font-bold tracking-wider text-amber-400 transition-all hover:bg-amber-500/25 hover:shadow-[0_0_24px_rgba(251,191,36,0.2)] active:scale-95"
          >
            BREAK
          </button>
        ) : (
          <button
            onClick={endBreak}
            className="btn-glow rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-8 py-4 text-lg font-bold tracking-wider text-emerald-400 transition-all hover:bg-emerald-500/25 hover:shadow-[0_0_24px_rgba(52,211,153,0.2)] active:scale-95"
          >
            RESUME
          </button>
        )}
        <button
          onClick={clockOut}
          className="btn-glow rounded-xl border border-rose-500/40 bg-rose-500/15 px-8 py-4 text-lg font-bold tracking-wider text-rose-400 transition-all hover:bg-rose-500/25 hover:shadow-[0_0_24px_rgba(251,113,133,0.2)] active:scale-95"
        >
          CLOCK OUT
        </button>
      </div>

      {status === "running" && (
        <div className="flex flex-col items-center gap-2">
          {!showDeduct ? (
            <button
              onClick={() => setShowDeduct(true)}
              className="rounded-lg border border-slate-700 px-5 py-2 text-xs font-medium tracking-wide text-slate-500 transition-all hover:border-rose-500/30 hover:text-rose-400"
            >
              LOST FOCUS? SUBTRACT TIME
            </button>
          ) : (
            <div className="glass flex items-center gap-2 rounded-xl p-3">
              <input
                type="number"
                min="1"
                placeholder="min"
                value={deductMinutes}
                onChange={(e) => setDeductMinutes(e.target.value)}
                className="futuristic w-24 rounded-lg px-3 py-2 text-center text-sm"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleDeduct()}
              />
              <button
                onClick={handleDeduct}
                className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold tracking-wide text-rose-400 transition-all hover:bg-rose-500/25"
              >
                DEDUCT
              </button>
              <button
                onClick={() => {
                  setShowDeduct(false);
                  setDeductMinutes("");
                }}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
