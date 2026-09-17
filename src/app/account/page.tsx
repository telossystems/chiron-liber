import { redirect } from "next/navigation";

import { ManageBillingButton } from "@/components/manage-billing-button";
import { SiteShell } from "@/components/site-shell";
import {
  effectiveOfferStatus,
  formatOfferDate,
  formatUsdCents,
  type OfferRow,
} from "@/lib/offers";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string | null) {
  return formatOfferDate(value);
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const [{ data: subscription }, { data: payments }, { data: offers }] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select(
          "id, status, amount_cents, current_period_end, cancel_at_period_end",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("payments")
        .select("id, amount_cents, status, paid_at, hosted_invoice_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("offers")
        .select(
          "id, customer_user_id, customer_email, amount_cents, currency, interval, note, status, expires_at, accepted_at, declined_at, revoked_at, stripe_checkout_session_id, subscription_id, created_by, created_at, updated_at",
        )
        .eq("customer_user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const offerRows = (offers ?? []) as OfferRow[];
  const pendingOffer = offerRows.find(
    (offer) => effectiveOfferStatus(offer) === "pending",
  );

  return (
    <SiteShell current="account" footerNote="Account">
      <section className="mx-auto flex w-full max-w-frame flex-col px-6 pt-16 pb-24 md:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#737373]">
              Dossier // Account
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.14em] text-white">
              Billing record
            </h1>
            <p className="mt-3 font-body text-body text-[#b3b3b3]">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-label text-label-sm font-semibold uppercase tracking-label-wide text-[#737373] hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>

        <article className="mt-12 border border-[#222222] bg-[#0f0f0f]">
          <div className="flex items-center justify-between border-b border-[#222222] px-8 py-5">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
              Offers
            </p>
            {pendingOffer ? (
              <a
                href={`/offers/${pendingOffer.id}`}
                className="inline-flex h-10 items-center justify-center rounded-pill bg-white px-6 font-label text-[10px] font-semibold uppercase tracking-label-wide text-black"
              >
                Review offer
              </a>
            ) : null}
          </div>
          {offerRows.length > 0 ? (
            <ul className="divide-y divide-[#1c1c1c]">
              {offerRows.map((offer) => {
                const status = effectiveOfferStatus(offer);
                return (
                  <li
                    key={offer.id}
                    className="flex items-center justify-between gap-4 px-8 py-4"
                  >
                    <div>
                      <p className="font-display text-sm text-white">
                        {formatUsdCents(offer.amount_cents)}
                        <span className="ml-2 font-label text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                          / mo
                        </span>
                      </p>
                      <p className="mt-1 font-label text-[8px] uppercase tracking-[0.2em] text-[#737373]">
                        {status} · {formatDate(offer.created_at)}
                      </p>
                    </div>
                    <a
                      href={`/offers/${offer.id}`}
                      className="font-label text-[9px] uppercase tracking-[0.18em] text-[#a3a3a3] hover:text-white"
                    >
                      Open
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-8 py-10 font-body text-body text-[#b3b3b3]">
              No offer has been extended yet.
            </p>
          )}
        </article>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <article className="border border-[#222222] bg-[#0f0f0f] p-8">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
              Current subscription
            </p>
            {subscription ? (
              <>
                <p className="mt-6 font-display text-4xl font-semibold text-white">
                  {formatUsdCents(subscription.amount_cents)}
                  <span className="ml-2 font-label text-[11px] uppercase tracking-[0.2em] text-[#737373]">
                    / mo
                  </span>
                </p>
                <dl className="mt-6 space-y-3">
                  <div className="flex justify-between gap-4">
                    <dt className="font-label text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                      Status
                    </dt>
                    <dd className="font-label text-[10px] uppercase tracking-[0.16em] text-white">
                      {subscription.status}
                      {subscription.cancel_at_period_end ? " · ending" : ""}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-label text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                      Next renewal
                    </dt>
                    <dd className="font-body text-body-sm text-white">
                      {formatDate(subscription.current_period_end)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-8">
                  <ManageBillingButton />
                </div>
              </>
            ) : (
              <p className="mt-6 font-body text-body leading-body text-[#b3b3b3]">
                No retainer is on file. When an offer is extended, it appears
                above.
              </p>
            )}
          </article>

          <article className="border border-[#222222] bg-[#0f0f0f]">
            <div className="border-b border-[#222222] px-8 py-5">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
                Payment history
              </p>
            </div>
            {payments && payments.length > 0 ? (
              <ul className="divide-y divide-[#1c1c1c]">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-4 px-8 py-4"
                  >
                    <div>
                      <p className="font-display text-sm text-white">
                        {formatUsdCents(payment.amount_cents)}
                      </p>
                      <p className="mt-1 font-label text-[8px] uppercase tracking-[0.2em] text-[#737373]">
                        {payment.status} · {formatDate(payment.paid_at ?? payment.created_at)}
                      </p>
                    </div>
                    {payment.hosted_invoice_url ? (
                      <a
                        href={payment.hosted_invoice_url}
                        className="font-label text-[9px] uppercase tracking-[0.18em] text-[#a3a3a3] hover:text-white"
                      >
                        Invoice
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-8 py-10 font-body text-body text-[#b3b3b3]">
                No invoices yet. They appear here after Stripe confirms payment.
              </p>
            )}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
