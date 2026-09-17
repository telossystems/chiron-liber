import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  findUserIdByCustomer,
  markOfferAccepted,
  upsertPayment,
  upsertSubscription,
} from "@/lib/billing";
import { requireEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function customerId(value: string | Stripe.Customer | Stripe.DeletedCustomer) {
  return typeof value === "string" ? value : value.id;
}

async function claimEvent(event: Stripe.Event) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
  });

  if (error) {
    if (error.code === "23505") {
      return false;
    }
    throw new Error(error.message);
  }

  return true;
}

async function resolveUserId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
  metadataUserId?: string | null,
) {
  if (metadataUserId) return metadataUserId;
  return findUserIdByCustomer(customerId(customer));
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const claimed = await claimEvent(event);
  if (!claimed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id,
      );
      const userId = await resolveUserId(
        session.customer,
        session.metadata?.user_id ?? subscription.metadata?.user_id,
      );
      if (userId) {
        await upsertSubscription(subscription, userId);
      }
      const offerId = session.metadata?.offer_id;
      if (offerId) {
        await markOfferAccepted(offerId, subscription.id);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(
        subscription.customer,
        subscription.metadata?.user_id,
      );
      if (userId) {
        await upsertSubscription(subscription, userId);
      }
      break;
    }
    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.customer) break;
      const invoiceRecord = invoice as Stripe.Invoice & {
        metadata?: { user_id?: string };
      };
      const userId = await resolveUserId(
        invoice.customer,
        invoice.metadata?.user_id ?? invoiceRecord.metadata?.user_id,
      );
      if (userId) {
        await upsertPayment(
          invoice,
          userId,
          event.type === "invoice.payment_failed" ? "failed" : undefined,
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
