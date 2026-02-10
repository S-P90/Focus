"use client";

import Navbar from "@/components/Navbar";
import TimerDisplay from "@/components/TimerDisplay";
import ActionButtons from "@/components/ActionButtons";
import SessionSummary from "@/components/SessionSummary";
import AuthBanner from "@/components/AuthBanner";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-grid">
      {/* Ambient glow orbs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Scan line */}
      <div className="scan-line pointer-events-none" />

      <Navbar />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
        <TimerDisplay />
        <ActionButtons />
        <SessionSummary />
        <AuthBanner />
      </main>

      {/* Bottom status bar */}
      <div className="glass relative z-10 border-t border-cyan-500/10 px-4 py-2 text-center text-[10px] tracking-widest text-slate-600">
        FOCUS PRODUCTIVITY SYSTEM v1.0 &middot; TIME IS YOUR MOST VALUABLE
        RESOURCE
      </div>
    </div>
  );
}
