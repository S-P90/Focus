"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { Session, TimerStatus, LostFocusDeduction } from "@/lib/types";
import { generateId, calcSessionStats } from "@/lib/utils";

interface TimerContextValue {
  session: Session | null;
  status: TimerStatus;
  elapsed: number;
  clockIn: () => void;
  clockOut: () => void;
  startBreak: () => void;
  endBreak: () => void;
  deductTime: (minutes: number) => void;
  reset: () => void;
  getStats: () => ReturnType<typeof calcSessionStats> | null;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTicking = useCallback((startTime: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 200);
  }, []);

  const stopTicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clockIn = useCallback(() => {
    const now = Date.now();
    const newSession: Session = {
      id: generateId(),
      startTime: now,
      endTime: null,
      breaks: [],
      deductions: [],
    };
    setSession(newSession);
    setStatus("running");
    setElapsed(0);
    startTicking(now);
  }, [startTicking]);

  const clockOut = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, endTime: Date.now() };
      // End any active break
      if (updated.breaks.length > 0) {
        const lastBreak = updated.breaks[updated.breaks.length - 1];
        if (!lastBreak.endTime) {
          updated.breaks = [
            ...updated.breaks.slice(0, -1),
            { ...lastBreak, endTime: Date.now() },
          ];
        }
      }
      return updated;
    });
    setStatus("finished");
    stopTicking();
  }, [stopTicking]);

  const startBreak = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        breaks: [...prev.breaks, { startTime: Date.now(), endTime: null }],
      };
    });
    setStatus("break");
  }, []);

  const endBreak = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const breaks = [...prev.breaks];
      const lastBreak = breaks[breaks.length - 1];
      if (lastBreak && !lastBreak.endTime) {
        breaks[breaks.length - 1] = { ...lastBreak, endTime: Date.now() };
      }
      return { ...prev, breaks };
    });
    setStatus("running");
  }, []);

  const deductTime = useCallback((minutes: number) => {
    const deduction: LostFocusDeduction = {
      timestamp: Date.now(),
      minutes,
    };
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, deductions: [...prev.deductions, deduction] };
    });
  }, []);

  const reset = useCallback(() => {
    stopTicking();
    setSession(null);
    setStatus("idle");
    setElapsed(0);
  }, [stopTicking]);

  const getStats = useCallback(() => {
    if (!session) return null;
    return calcSessionStats(session);
  }, [session]);

  return (
    <TimerContext.Provider
      value={{
        session,
        status,
        elapsed,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        deductTime,
        reset,
        getStats,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
