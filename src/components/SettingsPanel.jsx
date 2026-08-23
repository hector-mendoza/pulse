"use client";

import { useActionState } from "react";
import { saveVercelToken, disconnectVercelToken } from "@/app/settings/actions";
import { AppearanceSettings } from "@/components/AppearanceSettings";
import { NavIcon } from "@/components/icons";

function SettingsCard({ title, description, icon, children }) {
  return (
    <section className="card-shadow rounded-2xl border border-panel-border bg-panel p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
          <NavIcon name={icon} size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold">{title}</h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-text-dim">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function SettingsPanel({ vercelToken }) {
  const [state, formAction, pending] = useActionState(saveVercelToken, null);

  return (
    <div className="mx-5 flex flex-col gap-4 pb-4 lg:mx-0">
      <SettingsCard
        icon="Server"
        title="Vercel account"
        description={
          <>
            Connect a personal access token so Pulse can read your projects and
            deployments.
          </>
        }
      >
        {vercelToken ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-status-ready/30 bg-status-ready/8 px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 flex-none rounded-full bg-status-ready" />
              <div>
                <div className="text-[13px] font-medium text-status-ready">
                  Connected
                </div>
                <div className="text-[11.5px] text-text-dim">
                  Token added{" "}
                  {new Date(vercelToken.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <form action={disconnectVercelToken}>
              <button
                type="submit"
                className="pressable rounded-lg border border-panel-border px-2.5 py-1.5 text-[12px] font-medium text-text-faint hover:text-status-error"
              >
                Disconnect
              </button>
            </form>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <input
              type="password"
              name="token"
              required
              placeholder="vercel_pat_…"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
              className="rounded-xl border border-panel-border bg-background px-3.5 py-2.5 font-mono text-[13px] text-foreground transition-colors placeholder:text-text-faint focus:border-primary/50 focus:outline-none"
            />

            {state?.error && (
              <p className="flex items-center gap-2 rounded-xl border border-status-error/30 bg-status-error/8 px-3 py-2 text-[12.5px] text-status-error">
                <NavIcon name="TriangleAlert" size={14} />
                {state.error}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="pressable rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
              >
                {pending ? "Verifying…" : "Connect Vercel"}
              </button>
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary"
              >
                Create a token
                <NavIcon name="ExternalLink" size={12} />
              </a>
            </div>
          </form>
        )}
      </SettingsCard>

      <SettingsCard
        icon="Droplet"
        title="Appearance"
        description="Pick a color scheme and an accent. Both are saved on this device and applied before the app paints."
      >
        <AppearanceSettings />
      </SettingsCard>
    </div>
  );
}
