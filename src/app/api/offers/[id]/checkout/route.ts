import { NextResponse } from "next/server";

import { ensureStripeCustomer } from "@/lib/billing";
import { getUser } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
import { effectiveOfferStatus, isUuid, type OfferRow } from "@/lib/offers";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data: offer, error } = await admin
    .from("offers")
    .select(
      "id, customer_user_id, customer_email, amount_cents, currency, interval, note, status, expires_at, accepted_at, declined_at, revoked_at, stripe_checkout_session_id, subscription_id, created_by, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = offer as OfferRow | null;
  if (!row || row.customer_user_id !== user.id) {
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  }

  if (effectiveOfferStatus(row) !== "pending") {
    return NextResponse.json(
      { error: "This offer is no longer available." },
      { status: 400 },
    );
  }

  let customerId: string;
  try {
    customerId = await ensureStripeCustomer(user);
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Unable to create Stripe customer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const origin = siteUrl();
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    metadata: { user_id: user.id, offer_id: row.id },
    subscription_data: {
      metadata: { user_id: user.id, offer_id: row.id },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: row.currency,
          unit_amount: row.amount_cents,
          recurring: { interval: "month" },
          product_data: {
            name: "The Process",
            description:
              "Monthly retainer for synthesis, construction, hosting, and deployment access.",
          },
        },
      },
    ],
    success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/offers/${row.id}`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL." },
      { status: 500 },
    );
  }

  const { error: updateError } = await admin
    .from("offers")
    .update({
      stripe_checkout_session_id: session.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("status", "pending");

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
