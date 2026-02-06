"use client";

import { useState } from "react";
import { useTimer } from "@/contexts/TimerContext";

export default function ActionButtons() {
  const { status, clockIn, clockOut, startBreak, endBreak, deductTime, reset } =
    useTimer();
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
          className="rounded-2xl bg-emerald-500 px-12 py-5 text-xl font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40 active:scale-95"
        >
          Clock In
        </button>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={reset}
          className="rounded-2xl bg-indigo-500 px-12 py-5 text-xl font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 active:scale-95"
        >
          New Session
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3">
        {status === "running" ? (
          <button
            onClick={startBreak}
            className="rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95"
          >
            Take Break
          </button>
        ) : (
          <button
            onClick={endBreak}
            className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-95"
          >
            Resume
          </button>
        )}
        <button
          onClick={clockOut}
          className="rounded-xl bg-rose-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600 active:scale-95"
        >
          Clock Out
        </button>
      </div>

      {status === "running" && (
        <div className="flex flex-col items-center gap-2">
          {!showDeduct ? (
            <button
              onClick={() => setShowDeduct(true)}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-rose-700 dark:hover:text-rose-400"
            >
              Lost Focus? Subtract Time
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
              <input
                type="number"
                min="1"
                placeholder="Minutes lost"
                value={deductMinutes}
                onChange={(e) => setDeductMinutes(e.target.value)}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm dark:border-gray-700 dark:bg-gray-800"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleDeduct()}
              />
              <button
                onClick={handleDeduct}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                Deduct
              </button>
              <button
                onClick={() => {
                  setShowDeduct(false);
                  setDeductMinutes("");
                }}
                className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
