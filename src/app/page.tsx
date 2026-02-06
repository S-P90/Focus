"use client";

import Navbar from "@/components/Navbar";
import TimerDisplay from "@/components/TimerDisplay";
import ActionButtons from "@/components/ActionButtons";
import SessionSummary from "@/components/SessionSummary";
import AuthBanner from "@/components/AuthBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-12">
        <TimerDisplay />
        <ActionButtons />
        <SessionSummary />
        <AuthBanner />
      </main>
    </div>
  );
}
