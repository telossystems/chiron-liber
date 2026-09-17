"use client";

import { useActionState } from "react";

import { CustomerPicker } from "@/app/admin/offers/customer-picker";
import { createOffer } from "@/app/admin/offers/actions";
import { MAX_AMOUNT_DOLLARS, MIN_AMOUNT_DOLLARS } from "@/lib/env";

type Customer = {
  id: string;
  email: string | null;
};

export function CreateOfferForm({ customers }: { customers: Customer[] }) {
  const [state, action, pending] = useActionState(createOffer, null);

  return (
    <form action={action} className="space-y-6">
      <CustomerPicker customers={customers} />

      <label className="block">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
          Monthly amount (USD)
        </span>
        <input
          type="number"
          name="amount"
          required
          min={MIN_AMOUNT_DOLLARS}
          max={MAX_AMOUNT_DOLLARS}
          step={1}
          defaultValue={500}
          className="mt-2 w-full border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-display text-xl text-white outline-none focus:border-white"
        />
        <span className="mt-2 block font-label text-[8px] uppercase tracking-[0.2em] text-[#666666]">
          {MIN_AMOUNT_DOLLARS}–{MAX_AMOUNT_DOLLARS} / month
        </span>
      </label>

      <label className="block">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
          Note
        </span>
        <textarea
          name="note"
          rows={3}
          placeholder="What was agreed"
          className="mt-2 w-full resize-y border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-body text-body text-white outline-none focus:border-white"
        />
      </label>

      <label className="block">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
          Expires
        </span>
        <input
          type="datetime-local"
          name="expires_at"
          className="mt-2 w-full border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-body text-body text-white outline-none focus:border-white"
        />
      </label>

      <button
        type="submit"
        disabled={pending || customers.length === 0}
        className="inline-flex h-11 w-full items-center justify-center rounded-pill bg-white font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity hover:opacity-[0.88] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Creating…" : "Create offer"}
      </button>

      {state?.error ? (
        <p className="font-body text-body-sm text-[#d4d4d4]">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="font-body text-body-sm text-[#a3a3a3]">Offer created.</p>
      ) : null}
    </form>
  );
}
