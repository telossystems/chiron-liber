"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { MAX_AMOUNT_DOLLARS, MIN_AMOUNT_DOLLARS } from "@/lib/env";
import { isUuid } from "@/lib/offers";

export type OfferActionState = { error?: string; ok?: boolean } | null;

export async function createOffer(
  _prev: OfferActionState,
  formData: FormData,
): Promise<OfferActionState> {
  const { supabase, user } = await requireAdmin();
  const customerUserId = String(formData.get("customer_user_id") ?? "").trim();
  const dollars = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;
  const expiresRaw = String(formData.get("expires_at") ?? "").trim();

  if (!isUuid(customerUserId)) {
    return { error: "Select a registered customer." };
  }

  if (
    !Number.isInteger(dollars) ||
    dollars < MIN_AMOUNT_DOLLARS ||
    dollars > MAX_AMOUNT_DOLLARS
  ) {
    return {
      error: `Amount must be a whole dollar between ${MIN_AMOUNT_DOLLARS} and ${MAX_AMOUNT_DOLLARS}.`,
    };
  }

  const { data: customer, error: customerError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", customerUserId)
    .maybeSingle();

  if (customerError) {
    return { error: customerError.message };
  }
  if (!customer) {
    return { error: "Customer not found." };
  }

  let expiresAt: string | null = null;
  if (expiresRaw) {
    const parsed = new Date(expiresRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "Invalid expiry." };
    }
    expiresAt = parsed.toISOString();
  }

  const { error } = await supabase.from("offers").insert({
    customer_user_id: customer.id,
    customer_email: customer.email,
    amount_cents: dollars * 100,
    note,
    expires_at: expiresAt,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
  revalidatePath("/account");
  return { ok: true };
}

export async function revokeOfferAction(formData: FormData) {
  await revokeOffer(String(formData.get("offer_id") ?? ""));
}

export async function revokeOffer(offerId: string) {
  const { supabase } = await requireAdmin();

  if (!isUuid(offerId)) {
    return { error: "Invalid offer." };
  }

  const { data, error } = await supabase
    .from("offers")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", offerId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "Only a pending offer can be revoked." };
  }

  revalidatePath("/admin/offers");
  revalidatePath("/account");
  revalidatePath(`/offers/${offerId}`);
  return { ok: true };
}
