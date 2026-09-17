import { revokeOfferAction } from "@/app/admin/offers/actions";
import { CreateOfferForm } from "@/app/admin/offers/create-offer-form";
import { CopyLinkButton } from "@/components/copy-link-button";
import { SiteShell } from "@/components/site-shell";
import { requireAdmin } from "@/lib/auth";
import {
  effectiveOfferStatus,
  formatOfferDate,
  formatUsdCents,
  type OfferRow,
} from "@/lib/offers";

export default async function AdminOffersPage() {
  const { supabase } = await requireAdmin();

  const [{ data: customers }, { data: offers }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email")
      .order("email", { ascending: true }),
    supabase
      .from("offers")
      .select(
        "id, customer_user_id, customer_email, amount_cents, currency, interval, note, status, expires_at, accepted_at, declined_at, revoked_at, stripe_checkout_session_id, subscription_id, created_by, created_at, updated_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  const rows = (offers ?? []) as OfferRow[];

  return (
    <SiteShell current="admin" footerNote="Admin">
      <section className="mx-auto flex w-full max-w-frame flex-col px-6 pt-16 pb-24 md:px-12">
        <p className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#737373]">
          Directive // Offers
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.14em] text-white">
          Extend a retainer
        </h1>
        <p className="mt-3 max-w-2xl font-body text-body text-[#b3b3b3]">
          Select a registered account and set the monthly amount. The customer
          accepts in their portal by paying that figure.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[20rem_1fr]">
          <article className="border border-[#222222] bg-[#0f0f0f] p-8">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
              New offer
            </p>
            <div className="mt-6">
              <CreateOfferForm customers={customers ?? []} />
            </div>
          </article>

          <article className="border border-[#222222] bg-[#0f0f0f]">
            <div className="border-b border-[#222222] px-8 py-5">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
                Issued offers
              </p>
            </div>
            {rows.length > 0 ? (
              <ul className="divide-y divide-[#1c1c1c]">
                {rows.map((offer) => {
                  const status = effectiveOfferStatus(offer);
                  return (
                    <li
                      key={offer.id}
                      className="flex flex-col gap-4 px-8 py-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-display text-sm text-white">
                          {formatUsdCents(offer.amount_cents)}
                          <span className="ml-2 font-label text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                            / mo
                          </span>
                        </p>
                        <p className="mt-1 font-body text-body-sm text-[#b3b3b3]">
                          {offer.customer_email ?? offer.customer_user_id}
                        </p>
                        <p className="mt-1 font-label text-[8px] uppercase tracking-[0.2em] text-[#737373]">
                          {status} · created {formatOfferDate(offer.created_at)}
                          {offer.expires_at
                            ? ` · expires ${formatOfferDate(offer.expires_at)}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <CopyLinkButton path={`/offers/${offer.id}`} />
                        {status === "pending" ? (
                          <form action={revokeOfferAction}>
                            <input type="hidden" name="offer_id" value={offer.id} />
                            <button
                              type="submit"
                              className="font-label text-[9px] uppercase tracking-[0.18em] text-[#a3a3a3] hover:text-white"
                            >
                              Revoke
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-8 py-10 font-body text-body text-[#b3b3b3]">
                No offers have been issued.
              </p>
            )}
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
