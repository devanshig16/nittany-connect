"use client";

import { useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover"
    >
      {copied ? "Copied!" : "Copy email"}
    </button>
  );
}
