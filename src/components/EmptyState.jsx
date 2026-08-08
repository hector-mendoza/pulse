export function EmptyState({ icon, title, description }) {
  return (
    <div className="mx-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-panel-border px-6 py-16 text-center lg:mx-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-panel-border bg-panel text-lg text-text-dim">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold">{title}</h3>
      <p className="max-w-xs text-[13px] leading-relaxed text-text-dim">
        {description}
      </p>
    </div>
  );
}
