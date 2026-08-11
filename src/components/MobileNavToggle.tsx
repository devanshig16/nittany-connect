"use client";

import { useState } from "react";

export function MobileNavToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
      >
        <span className="flex flex-col items-center justify-center gap-1">
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
        </span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-neutral-200 bg-[var(--background)] px-6 py-4 dark:border-neutral-800">
          <div className="flex flex-col items-start gap-4">{children}</div>
        </div>
      )}
    </div>
  );
}
