"use client";

import { useMemo } from "react";
import { SavedSession } from "@/lib/types";
import { formatMinutes, getWeekStart, getMonthStart } from "@/lib/utils";

interface StatsViewProps {
  sessions: SavedSession[];
}

export default function StatsView({ sessions }: StatsViewProps) {
  const now = new Date();
  const weekStart = getWeekStart(now).getTime();
  const monthStart = getMonthStart(now).getTime();

  const allTimeStats = useMemo(() => aggregate(sessions), [sessions]);
  const weekStats = useMemo(
    () => aggregate(sessions.filter((s) => s.startTime >= weekStart)),
    [sessions, weekStart]
  );
  const monthStats = useMemo(
    () => aggregate(sessions.filter((s) => s.startTime >= monthStart)),
    [sessions, monthStart]
  );

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          No sessions saved yet. Complete a focus session and save it to see your
          statistics here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <StatsBlock title="This Week" stats={weekStats} />
      <StatsBlock title="This Month" stats={monthStats} />
      <StatsBlock title="All Time" stats={allTimeStats} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
          Recent Sessions
        </h3>
        <div className="flex flex-col gap-2">
          {sessions
            .slice()
            .reverse()
            .slice(0, 10)
            .map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(s.startTime).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(s.startTime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    &ndash;{" "}
                    {new Date(s.endTime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatMinutes(s.productiveTime / 60000)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.totalElapsed > 0
                      ? Math.round(
                          (s.productiveTime / s.totalElapsed) * 100
                        )
                      : 0}
                    % eff.
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

interface AggregatedStats {
  sessionCount: number;
  totalTime: number;
  productiveTime: number;
  breakTime: number;
  deductedTime: number;
  avgEfficiency: number;
}

function aggregate(sessions: SavedSession[]): AggregatedStats {
  if (sessions.length === 0) {
    return {
      sessionCount: 0,
      totalTime: 0,
      productiveTime: 0,
      breakTime: 0,
      deductedTime: 0,
      avgEfficiency: 0,
    };
  }
  const totalTime = sessions.reduce((s, x) => s + x.totalElapsed, 0);
  const productiveTime = sessions.reduce((s, x) => s + x.productiveTime, 0);
  const breakTime = sessions.reduce((s, x) => s + x.totalBreakTime, 0);
  const deductedTime = sessions.reduce((s, x) => s + x.totalDeducted, 0);
  const avgEfficiency =
    totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;

  return {
    sessionCount: sessions.length,
    totalTime,
    productiveTime,
    breakTime,
    deductedTime,
    avgEfficiency,
  };
}

function StatsBlock({
  title,
  stats,
}: {
  title: string;
  stats: AggregatedStats;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {stats.sessionCount === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No sessions in this period.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Sessions" value={stats.sessionCount.toString()} />
          <MiniStat
            label="Productive"
            value={formatMinutes(stats.productiveTime / 60000)}
            color="emerald"
          />
          <MiniStat
            label="Breaks"
            value={formatMinutes(stats.breakTime / 60000)}
            color="amber"
          />
          <MiniStat
            label="Efficiency"
            value={`${stats.avgEfficiency}%`}
            color="indigo"
          />
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: "emerald" | "amber" | "indigo";
}) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${color ? colors[color] : "text-gray-900 dark:text-gray-100"}`}
      >
        {value}
      </p>
    </div>
  );
}
