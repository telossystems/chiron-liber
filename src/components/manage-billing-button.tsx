"use client";

import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/billing/portal", { method: "POST" });
    const payload = (await response.json().catch(() => null)) as {
      url?: string;
      error?: string;
    } | null;

    if (!response.ok || !payload?.url) {
      setLoading(false);
      setError(payload?.error ?? "Unable to open billing portal.");
      return;
    }

    window.location.assign(payload.url);
  }

  return (
    <div>
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-pill bg-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity hover:opacity-[0.88] disabled:opacity-40"
      >
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error ? (
        <p className="mt-3 font-body text-body-sm text-[#d4d4d4]">{error}</p>
      ) : null}
    </div>
  );
}
