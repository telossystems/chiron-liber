import { notFound } from "next/navigation";

import { OfferActions } from "@/components/offer-actions";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import {
  effectiveOfferStatus,
  formatOfferDate,
  formatUsdCents,
  isUuid,
  type OfferRow,
} from "@/lib/offers";

const statusCopy: Record<string, string> = {
  pending: "This retainer is ready for your acceptance.",
  accepted: "This offer has been accepted and billed.",
  declined: "This offer was declined.",
  revoked: "This offer was withdrawn.",
  expired: "This offer has expired.",
};

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isUuid(id)) {
    notFound();
  }

  const { supabase, user } = await requireUser(`/offers/${id}`);
  const { data: offer } = await supabase
    .from("offers")
    .select(
      "id, customer_user_id, customer_email, amount_cents, currency, interval, note, status, expires_at, accepted_at, declined_at, revoked_at, stripe_checkout_session_id, subscription_id, created_by, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!offer) {
    notFound();
  }

  const row = offer as OfferRow;
  const status = effectiveOfferStatus(row);
  const canAct = status === "pending" && row.customer_user_id === user.id;

  return (
    <SiteShell current="offers" footerNote="Offer">
      <section className="mx-auto flex w-full max-w-frame flex-col items-center px-6 pt-20 pb-24 md:px-12">
        <div className="inline-flex items-center border border-[#222222] bg-[#121212] px-4 py-1.5">
          <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3a3a3]">
            Dossier // Offer
          </span>
        </div>

        <div className="relative mt-12 w-full max-w-2xl border border-[#222222] bg-[#0f0f0f] text-left">
          <span className="absolute -top-[5px] -left-[5px] text-[10px] text-[#444444]">
            ┌
          </span>
          <span className="absolute -top-[5px] -right-[5px] text-[10px] text-[#444444]">
            ┐
          </span>
          <span className="absolute -bottom-[5px] -left-[5px] text-[10px] text-[#444444]">
            └
          </span>
          <span className="absolute -bottom-[5px] -right-[5px] text-[10px] text-[#444444]">
            ┘
          </span>

          <div className="flex items-center justify-between border-b border-[#222222] bg-[#141414] px-6 py-3.5">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              Retainer offered
            </span>
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
              {status}
            </span>
          </div>

          <div className="p-8 md:p-10">
            <p className="font-display text-4xl font-semibold text-white">
              {formatUsdCents(row.amount_cents)}
              <span className="ml-2 font-label text-[11px] uppercase tracking-[0.2em] text-[#737373]">
                / month
              </span>
            </p>
            <p className="mt-4 font-body text-body leading-body text-[#b3b3b3]">
              {statusCopy[status]}
            </p>

            {row.note ? (
              <p className="mt-6 border border-[#222222] bg-[#121212] p-4 font-body text-body text-[#ededed]">
                {row.note}
              </p>
            ) : null}

            <dl className="mt-8 space-y-3">
              <div className="flex justify-between gap-4">
                <dt className="font-label text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                  Issued
                </dt>
                <dd className="font-body text-body-sm text-white">
                  {formatOfferDate(row.created_at)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-label text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                  Expires
                </dt>
                <dd className="font-body text-body-sm text-white">
                  {formatOfferDate(row.expires_at)}
                </dd>
              </div>
            </dl>

            {canAct ? <OfferActions offerId={row.id} /> : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
