import { User, SavedSession } from "./types";

const USERS_KEY = "focus_users";
const CURRENT_USER_KEY = "focus_current_user";
const SESSIONS_KEY = "focus_sessions";

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Simple hash for demo purposes - not production-grade
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, []);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user: User | null): void {
  setItem(CURRENT_USER_KEY, user);
}

export async function signUp(
  email: string,
  name: string,
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const user: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    email,
    name,
    passwordHash: await hashPassword(password),
  };
  users.push(user);
  setItem(USERS_KEY, users);
  setCurrentUser(user);
  return { ok: true, user };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { ok: false, error: "No account found with this email." };
  const hash = await hashPassword(password);
  if (user.passwordHash !== hash)
    return { ok: false, error: "Incorrect password." };
  setCurrentUser(user);
  return { ok: true, user };
}

export function signOut(): void {
  setCurrentUser(null);
}

export function getSavedSessions(userId: string): SavedSession[] {
  const all = getItem<SavedSession[]>(SESSIONS_KEY, []);
  return all.filter((s) => s.userId === userId);
}

export function saveSession(session: SavedSession): void {
  const all = getItem<SavedSession[]>(SESSIONS_KEY, []);
  all.push(session);
  setItem(SESSIONS_KEY, all);
}
