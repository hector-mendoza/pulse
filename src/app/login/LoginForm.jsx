"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithMagicLink,
} from "./actions";

const MODES = [
  { id: "signin", label: "Sign in", action: signInWithPassword },
  { id: "signup", label: "Create account", action: signUpWithPassword },
  { id: "magic", label: "Magic link", action: signInWithMagicLink },
];

export function LoginForm() {
  const [mode, setMode] = useState("signin");
  const current = MODES.find((m) => m.id === mode);
  const [state, formAction, pending] = useActionState(current.action, null);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[#15A87E] font-mono text-sm font-bold text-brand-foreground">
          ▲
        </div>
        <h1 className="text-[17px] font-semibold tracking-tight">Pulse</h1>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-panel-border bg-panel p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-[12.5px] font-medium text-text-dim transition-colors",
              mode === m.id && "bg-secondary text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-text-dim" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-panel-border bg-panel px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-status-ready/50"
          />
        </div>

        {mode !== "magic" && (
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[12px] font-medium text-text-dim"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="rounded-lg border border-panel-border bg-panel px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-status-ready/50"
            />
          </div>
        )}

        {state?.error && (
          <p className="rounded-lg border border-status-error/30 bg-status-error/8 px-3 py-2 text-[12.5px] text-status-error">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p className="rounded-lg border border-status-ready/30 bg-status-ready/8 px-3 py-2 text-[12.5px] text-status-ready">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {pending ? "…" : current.label}
        </button>
      </form>
    </div>
  );
}
