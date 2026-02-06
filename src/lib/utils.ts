import { Session, Break } from "./types";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function calcBreakTime(breaks: Break[]): number {
  return breaks.reduce((total, b) => {
    const end = b.endTime ?? Date.now();
    return total + (end - b.startTime);
  }, 0);
}

export function calcSessionStats(session: Session) {
  const endTime = session.endTime ?? Date.now();
  const totalElapsed = endTime - session.startTime;
  const totalBreakTime = calcBreakTime(session.breaks);
  const totalDeducted = session.deductions.reduce(
    (sum, d) => sum + d.minutes * 60 * 1000,
    0
  );
  const productiveTime = Math.max(
    0,
    totalElapsed - totalBreakTime - totalDeducted
  );

  return {
    totalElapsed,
    totalBreakTime,
    totalDeducted,
    productiveTime,
  };
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
