"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavIcon } from "@/components/icons";

export function SearchModal({ onClose, projects }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const matches = query
    ? projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : projects.slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="card-shadow w-full max-w-lg rounded-2xl border border-panel-border bg-panel p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-panel-border px-3 py-3">
          <NavIcon name="Search" size={17} className="text-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search deploys, projects…"
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-text-faint focus:outline-none"
          />
          <kbd className="rounded border border-panel-border px-1.5 py-0.5 font-mono text-[10.5px] text-text-faint">
            Esc
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5">
          {matches.length === 0 && (
            <p className="px-3 py-6 text-center text-[13px] text-text-faint">
              No projects match &ldquo;{query}&rdquo;.
            </p>
          )}
          {matches.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                router.push(`/projects/${project.id}`);
                onClose();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-text-dim hover:bg-accent hover:text-primary"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-status-ready" />
              <span className="truncate font-mono">{project.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
