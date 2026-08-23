"use client";

import { NavIcon } from "@/components/icons";

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="mx-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-panel-border px-6 py-16 text-center lg:mx-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-panel-border bg-accent text-accent-foreground">
        <NavIcon name={icon} size={20} />
      </div>
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <p className="max-w-xs text-[13px] leading-relaxed text-text-dim">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="pressable mt-1 rounded-xl bg-primary px-4 py-2.5 text-[12.5px] font-semibold text-primary-foreground"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
