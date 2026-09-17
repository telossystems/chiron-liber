import { SiteShell } from "@/components/site-shell";
import { getStripe } from "@/lib/stripe";

function formatUsdCents(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((value ?? 0) / 100);
}

export default async function PricingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let amountLabel = "your retainer";
  let reference = sessionId ?? "pending";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (typeof session.amount_total === "number") {
        amountLabel = `${formatUsdCents(session.amount_total)} / month`;
      }
      reference = session.id;
    } catch {
      // Keep the generic confirmation if Stripe is unavailable.
    }
  }

  return (
    <SiteShell current="pricing" footerNote="Authorization confirmed">
      <section className="mx-auto flex w-full max-w-frame flex-col items-center px-6 pt-20 pb-24 text-center md:px-12">
        <div className="inline-flex items-center border border-[#222222] bg-[#121212] px-4 py-1.5">
          <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3a3a3]">
            Record confirmed
          </span>
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold uppercase tracking-[0.16em] text-white">
          Payment authorized
        </h1>
        <p className="mt-6 max-w-xl font-body text-body leading-body tracking-body text-[#b3b3b3]">
          {amountLabel} is now on file. Reference {reference}. The harness can
          proceed. Billing history is available in your account.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/account"
            className="inline-flex h-11 items-center justify-center rounded-pill bg-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity hover:opacity-[0.88]"
          >
            Open account
          </a>
          <a
            href="/pricing"
            className="inline-flex h-11 items-center justify-center border border-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-white"
          >
            Return to pricing
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
