export const OFFER_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "revoked",
  "expired",
] as const;

export type OfferStatus = (typeof OFFER_STATUSES)[number];

export type OfferRow = {
  id: string;
  customer_user_id: string;
  customer_email: string | null;
  amount_cents: number;
  currency: string;
  interval: string;
  note: string | null;
  status: OfferStatus;
  expires_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  revoked_at: string | null;
  stripe_checkout_session_id: string | null;
  subscription_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

export function effectiveOfferStatus(offer: {
  status: string;
  expires_at: string | null;
}): OfferStatus {
  if (
    offer.status === "pending" &&
    offer.expires_at &&
    new Date(offer.expires_at).getTime() <= Date.now()
  ) {
    return "expired";
  }
  return (OFFER_STATUSES as readonly string[]).includes(offer.status)
    ? (offer.status as OfferStatus)
    : "pending";
}

export function formatUsdCents(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export function formatOfferDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
