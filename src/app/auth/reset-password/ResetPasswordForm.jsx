"use client";

import { useActionState } from "react";
import { updatePassword } from "./actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[#15A87E] font-mono text-sm font-bold text-brand-foreground">
          ▲
        </div>
        <h1 className="text-[17px] font-semibold tracking-tight">Pulse</h1>
      </div>

      <p className="mb-4 text-[13px] leading-relaxed text-text-dim">
        Choose a new password for your account.
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[12px] font-medium text-text-dim"
            htmlFor="password"
          >
            New password
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

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[12px] font-medium text-text-dim"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="rounded-lg border border-panel-border bg-panel px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-status-ready/50"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg border border-status-error/30 bg-status-error/8 px-3 py-2 text-[12.5px] text-status-error">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {pending ? "…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
