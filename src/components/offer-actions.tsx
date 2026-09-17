"use client";

import { useState, useTransition } from "react";

import { declineOffer } from "@/app/offers/actions";

export function OfferActions({ offerId }: { offerId: string }) {
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function accept() {
    setAccepting(true);
    setError("");

    const response = await fetch(`/api/offers/${offerId}/checkout`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as {
      url?: string;
      error?: string;
    } | null;

    if (!response.ok || !payload?.url) {
      setAccepting(false);
      setError(payload?.error ?? "Unable to start checkout.");
      return;
    }

    window.location.assign(payload.url);
  }

  function decline() {
    startTransition(async () => {
      const result = await declineOffer(offerId);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  const busy = accepting || pending;

  return (
    <div className="mt-8 space-y-4">
      <button
        type="button"
        disabled={busy}
        onClick={accept}
        className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity hover:opacity-[0.88] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {accepting ? "Opening checkout…" : "Accept and Pay"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={decline}
        className="inline-flex h-11 w-full items-center justify-center border border-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-white disabled:opacity-40"
      >
        {pending ? "Declining…" : "Decline"}
      </button>
      {error ? (
        <p className="text-center font-body text-body-sm text-[#d4d4d4]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
