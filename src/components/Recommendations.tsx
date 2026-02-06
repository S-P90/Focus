"use client";

import { SavedSession } from "@/lib/types";
import { useMemo } from "react";

interface RecommendationsProps {
  sessions: SavedSession[];
}

export default function Recommendations({ sessions }: RecommendationsProps) {
  const tips = useMemo(() => generateTips(sessions), [sessions]);

  if (tips.length === 0) return null;

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/50">
      <h3 className="mb-3 text-lg font-bold text-indigo-900 dark:text-indigo-100">
        Focus Recommendations
      </h3>
      <ul className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-indigo-800 dark:text-indigo-200"
          >
            <span className="mt-0.5 text-indigo-500">&#9679;</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function generateTips(sessions: SavedSession[]): string[] {
  const tips: string[] = [];

  if (sessions.length === 0) {
    tips.push(
      "Complete your first session and save it to get personalized recommendations."
    );
    return tips;
  }

  const avgEfficiency =
    sessions.reduce(
      (s, x) =>
        s + (x.totalElapsed > 0 ? x.productiveTime / x.totalElapsed : 0),
      0
    ) / sessions.length;

  const avgProductiveMin =
    sessions.reduce((s, x) => s + x.productiveTime, 0) /
    sessions.length /
    60000;

  const avgBreakMin =
    sessions.reduce((s, x) => s + x.totalBreakTime, 0) /
    sessions.length /
    60000;

  const totalDeducted = sessions.reduce((s, x) => s + x.totalDeducted, 0);

  if (avgEfficiency < 0.5) {
    tips.push(
      "Your average efficiency is below 50%. Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break."
    );
  } else if (avgEfficiency < 0.75) {
    tips.push(
      "You're averaging around " +
        Math.round(avgEfficiency * 100) +
        "% efficiency. Consider removing distractions like phone notifications during focus periods."
    );
  } else {
    tips.push(
      "Great focus discipline! You're averaging " +
        Math.round(avgEfficiency * 100) +
        "% efficiency. Keep it up!"
    );
  }

  if (avgProductiveMin < 30) {
    tips.push(
      "Your sessions average " +
        Math.round(avgProductiveMin) +
        " minutes of productive time. Try gradually increasing to 45-60 minutes for deeper work."
    );
  }

  if (avgBreakMin > avgProductiveMin * 0.4) {
    tips.push(
      "Your break time is high relative to productive time. Try shorter, more structured breaks."
    );
  }

  if (totalDeducted > 0) {
    const avgDeductedMin =
      sessions.reduce((s, x) => s + x.totalDeducted, 0) /
      sessions.length /
      60000;
    tips.push(
      "You lose an average of " +
        Math.round(avgDeductedMin) +
        " minutes per session to lost focus. Try putting your phone in another room or using a website blocker."
    );
  }

  if (sessions.length >= 5) {
    const recent = sessions.slice(-5);
    const recentEff =
      recent.reduce(
        (s, x) =>
          s + (x.totalElapsed > 0 ? x.productiveTime / x.totalElapsed : 0),
        0
      ) / recent.length;
    const older = sessions.slice(0, -5);
    if (older.length > 0) {
      const olderEff =
        older.reduce(
          (s, x) =>
            s + (x.totalElapsed > 0 ? x.productiveTime / x.totalElapsed : 0),
          0
        ) / older.length;
      if (recentEff > olderEff + 0.05) {
        tips.push(
          "Your recent sessions show improvement! Your efficiency went from " +
            Math.round(olderEff * 100) +
            "% to " +
            Math.round(recentEff * 100) +
            "%."
        );
      }
    }
  }

  return tips;
}
