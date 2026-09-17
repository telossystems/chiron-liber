"use client";

import { useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const origin = window.location.origin;
    await navigator.clipboard.writeText(`${origin}${path}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="font-label text-[9px] uppercase tracking-[0.18em] text-[#a3a3a3] hover:text-white"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
