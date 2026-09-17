import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type SubscriptionRow = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  status: string;
  amount_cents: number;
  currency: string;
  interval: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
};

function unixToIso(value?: number | null) {
  return value ? new Date(value * 1000).toISOString() : null;
}

function subscriptionAmount(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return item?.price?.unit_amount ?? 0;
}

function subscriptionInterval(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.recurring?.interval ?? "month";
}

function subscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0] as
    | (Stripe.SubscriptionItem & {
        current_period_start?: number;
        current_period_end?: number;
      })
    | undefined;

  const start =
    item?.current_period_start ??
    (subscription as Stripe.Subscription & { current_period_start?: number })
      .current_period_start;
  const end =
    item?.current_period_end ??
    (subscription as Stripe.Subscription & { current_period_end?: number })
      .current_period_end;

  return {
    current_period_start: unixToIso(start),
    current_period_end: unixToIso(end),
  };
}

export async function ensureStripeCustomer(user: {
  id: string;
  email?: string | null;
}) {
  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await getStripe().customers.create({
    email: user.email ?? profile?.email ?? undefined,
    metadata: { user_id: user.id },
  });

  const { error: updateError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    stripe_customer_id: customer.id,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  return customer.id;
}

export async function markOfferAccepted(
  offerId: string,
  subscriptionId: string,
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("offers")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      subscription_id: subscriptionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", offerId)
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }
}

export async function findUserIdByCustomer(customerId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.id ?? null;
}

export async function upsertSubscription(
  subscription: Stripe.Subscription,
  userId: string,
) {
  const supabase = createAdminClient();
  const period = subscriptionPeriod(subscription);
  const row: SubscriptionRow = {
    id: subscription.id,
    user_id: userId,
    stripe_customer_id: String(subscription.customer),
    status: subscription.status,
    amount_cents: subscriptionAmount(subscription),
    currency: subscription.currency,
    interval: subscriptionInterval(subscription),
    current_period_start: period.current_period_start,
    current_period_end: period.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: unixToIso(subscription.canceled_at),
  };

  const { error } = await supabase.from("subscriptions").upsert(row);
  if (error) {
    throw new Error(error.message);
  }
}

function invoiceRef(
  invoice: Stripe.Invoice,
  key: "subscription" | "payment_intent",
) {
  const record = invoice as Stripe.Invoice & Record<string, unknown>;
  const parent = record.parent as unknown as Record<string, unknown> | undefined;
  const nested =
    parent?.subscription_details &&
    typeof parent.subscription_details === "object"
      ? (parent.subscription_details as Record<string, unknown>)
      : undefined;
  const payments = record.payments as Record<string, unknown> | undefined;
  const raw =
    record[key] ??
    nested?.[key] ??
    (key === "payment_intent" ? payments?.payment_intent : undefined);

  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "id" in raw) {
    return String((raw as { id: string }).id);
  }
  return null;
}

export async function upsertPayment(
  invoice: Stripe.Invoice,
  userId: string,
  statusOverride?: string,
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("payments").upsert({
    id: invoice.id,
    user_id: userId,
    subscription_id: invoiceRef(invoice, "subscription"),
    stripe_payment_intent_id: invoiceRef(invoice, "payment_intent"),
    amount_cents: invoice.amount_paid || invoice.amount_due || 0,
    currency: invoice.currency,
    status: statusOverride ?? invoice.status ?? "open",
    hosted_invoice_url: invoice.hosted_invoice_url,
    paid_at: invoice.status_transitions?.paid_at
      ? unixToIso(invoice.status_transitions.paid_at)
      : null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
