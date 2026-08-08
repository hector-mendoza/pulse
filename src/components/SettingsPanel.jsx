"use client";

import { useActionState } from "react";
import { saveVercelToken, disconnectVercelToken } from "@/app/settings/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SettingsPanel({ vercelToken }) {
  const [state, formAction, pending] = useActionState(saveVercelToken, null);

  return (
    <div className="mx-5 flex flex-col gap-4 lg:mx-0">
      <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-5">
        <h3 className="text-[14px] font-semibold">Vercel account</h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-text-dim">
          Connect a personal access token so Pulse can read your projects
          and deployments.{" "}
          <a
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-status-ready"
          >
            Create one on Vercel →
          </a>
        </p>

        {vercelToken ? (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-status-ready/30 bg-status-ready/8 px-3.5 py-3">
            <div>
              <div className="text-[13px] font-medium text-status-ready">
                Connected
              </div>
              <div className="text-[11.5px] text-text-dim">
                Token added{" "}
                {new Date(vercelToken.created_at).toLocaleDateString()}
              </div>
            </div>
            <form action={disconnectVercelToken}>
              <button
                type="submit"
                className="text-[12px] font-medium text-text-faint hover:text-status-error"
              >
                Disconnect
              </button>
            </form>
          </div>
        ) : (
          <form action={formAction} className="mt-4 flex flex-col gap-3">
            <input
              type="password"
              name="token"
              required
              placeholder="vercel_pat_…"
              className="rounded-lg border border-panel-border bg-background px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-status-ready/50"
            />

            {state?.error && (
              <p className="rounded-lg border border-status-error/30 bg-status-error/8 px-3 py-2 text-[12.5px] text-status-error">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="self-start rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
            >
              {pending ? "Verifying…" : "Connect Vercel"}
            </button>
          </form>
        )}
      </div>

      <div className="card-shadow rounded-2xl border border-panel-border bg-panel p-5">
        <h3 className="text-[14px] font-semibold">Appearance</h3>
        <p className="mt-1 mb-4 text-[12.5px] leading-relaxed text-text-dim">
          Switch between light and dark mode.
        </p>
        <ThemeToggle className="flex w-fit items-center gap-2 rounded-lg border border-panel-border bg-background px-3.5 py-2 text-[12.5px] font-semibold text-foreground" />
      </div>
    </div>
  );
}
