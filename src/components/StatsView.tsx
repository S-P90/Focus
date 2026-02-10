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
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-500">
          {"// no sessions saved yet. Complete a focus session and save it to see statistics here."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <StatsBlock title="THIS WEEK" stats={weekStats} />
      <StatsBlock title="THIS MONTH" stats={monthStats} />
      <StatsBlock title="ALL TIME" stats={allTimeStats} />

      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-cyan-400">
          {"// recent_sessions"}
        </h3>
        <div className="flex flex-col gap-2">
          {sessions
            .slice()
            .reverse()
            .slice(0, 10)
            .map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {new Date(s.startTime).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
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
                  <p className="text-sm font-bold text-emerald-400">
                    {formatMinutes(s.productiveTime / 60000)}
                  </p>
                  <p className="text-xs text-slate-500">
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
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-cyan-400">
        {"// " + title.toLowerCase().replace(" ", "_")}
      </h3>
      {stats.sessionCount === 0 ? (
        <p className="text-xs text-slate-500">
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
            color="violet"
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
  color?: "emerald" | "amber" | "violet";
}) {
  const borderColors = {
    emerald: "border-emerald-500/20",
    amber: "border-amber-500/20",
    violet: "border-violet-500/20",
  };
  const textColors = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
  };
  return (
    <div
      className={`rounded-xl border bg-slate-900/50 p-3 text-center ${
        color ? borderColors[color] : "border-slate-700/50"
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          color ? textColors[color] : "text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
