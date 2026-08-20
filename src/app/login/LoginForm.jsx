"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithMagicLink,
  signInWithGitHub,
  requestPasswordReset,
} from "./actions";

const MODES = [
  { id: "signin", label: "Sign in", action: signInWithPassword },
  { id: "signup", label: "Create account", action: signUpWithPassword },
  { id: "magic", label: "Magic link", action: signInWithMagicLink },
];

const AUTH_ERRORS = {
  invalid_link: "That link is invalid or has expired.",
  github: "GitHub sign-in failed. Please try again.",
  access_denied: "GitHub sign-in was cancelled.",
};

function GitHubMark({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function Brand() {
  return (
    <div className="mb-6 flex items-center gap-2.5">
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[#15A87E] font-mono text-sm font-bold text-brand-foreground">
        ▲
      </div>
      <h1 className="text-[17px] font-semibold tracking-tight">Pulse</h1>
    </div>
  );
}

function AuthAlert({ error, message }) {
  if (error) {
    return (
      <p className="rounded-lg border border-status-error/30 bg-status-error/8 px-3 py-2 text-[12.5px] text-status-error">
        {error}
      </p>
    );
  }

  if (message) {
    return (
      <p className="rounded-lg border border-status-ready/30 bg-status-ready/8 px-3 py-2 text-[12.5px] text-status-ready">
        {message}
      </p>
    );
  }

  return null;
}

function GitHubSignInButton({ nextPath }) {
  const [state, formAction, pending] = useActionState(signInWithGitHub, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {nextPath && nextPath !== "/" ? (
        <input type="hidden" name="next" value={nextPath} />
      ) : null}
      <AuthAlert error={state?.error} />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg border border-panel-border bg-panel px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
      >
        <GitHubMark className="size-4" />
        {pending ? "…" : "Continue with GitHub"}
      </button>
    </form>
  );
}

function ResetPasswordRequestForm({ onBack }) {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    null
  );

  return (
    <div className="w-full max-w-sm">
      <Brand />

      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-[12.5px] font-medium text-text-dim hover:text-foreground"
      >
        ← Back to sign in
      </button>

      <p className="mb-4 text-[13px] leading-relaxed text-text-dim">
        Enter your email and we&apos;ll send you a link to reset your
        password.
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[12px] font-medium text-text-dim"
            htmlFor="reset-email"
          >
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-panel-border bg-panel px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-status-ready/50"
          />
        </div>

        <AuthAlert error={state?.error} message={state?.message} />

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {pending ? "…" : "Send reset link"}
        </button>
      </form>
    </div>
  );
}

export function LoginForm({ authError, nextPath }) {
  const [mode, setMode] = useState("signin");
  const [showReset, setShowReset] = useState(false);
  const current = MODES.find((m) => m.id === mode);
  const [state, formAction, pending] = useActionState(current.action, null);
  const mappedAuthError = AUTH_ERRORS[authError];

  if (showReset) {
    return <ResetPasswordRequestForm onBack={() => setShowReset(false)} />;
  }

  return (
    <div className="w-full max-w-sm">
      <Brand />

      {mappedAuthError && (
        <div className="mb-4">
          <AuthAlert error={mappedAuthError} />
        </div>
      )}

      <GitHubSignInButton nextPath={nextPath} />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-panel-border" />
        <span className="text-[11px] font-medium tracking-wide text-text-faint uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-panel-border" />
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
            <div className="flex items-center justify-between">
              <label
                className="text-[12px] font-medium text-text-dim"
                htmlFor="password"
              >
                Password
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-[12px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
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

        <AuthAlert error={state?.error} message={state?.message} />

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
