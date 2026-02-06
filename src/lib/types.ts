export interface Break {
  startTime: number;
  endTime: number | null;
}

export interface LostFocusDeduction {
  timestamp: number;
  minutes: number;
}

export interface Session {
  id: string;
  startTime: number;
  endTime: number | null;
  breaks: Break[];
  deductions: LostFocusDeduction[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

export interface SavedSession {
  id: string;
  userId: string;
  startTime: number;
  endTime: number;
  totalElapsed: number;
  totalBreakTime: number;
  totalDeducted: number;
  productiveTime: number;
}

export type TimerStatus = "idle" | "running" | "break" | "finished";
