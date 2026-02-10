"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (mode === "signin") {
      result = await signIn(email, password);
    } else {
      if (!name.trim()) {
        setError("Name is required.");
        setLoading(false);
        return;
      }
      result = await signUp(email, name, password);
    }

    setLoading(false);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-grid">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="scan-line pointer-events-none" />

      <Navbar />
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="glass w-full max-w-sm rounded-2xl p-8">
          <h1 className="text-gradient-cyan mb-1 text-center text-2xl font-bold tracking-wider">
            {mode === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </h1>
          <p className="mb-6 text-center text-xs tracking-wide text-slate-500">
            {mode === "signin"
              ? "// authenticate to access all features"
              : "// join Focus to track productivity over time"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="your_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="futuristic rounded-lg px-4 py-3 text-sm"
                required
              />
            )}
            <input
              type="email"
              placeholder="email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="futuristic rounded-lg px-4 py-3 text-sm"
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="futuristic rounded-lg px-4 py-3 text-sm"
              required
              minLength={6}
            />

            {error && (
              <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow rounded-lg border border-cyan-500/40 bg-cyan-500/15 py-3 text-sm font-bold tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/25 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:opacity-50"
            >
              {loading
                ? "AUTHENTICATING..."
                : mode === "signin"
                  ? "SIGN IN"
                  : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
