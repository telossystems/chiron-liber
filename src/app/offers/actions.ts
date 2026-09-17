"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { isUuid } from "@/lib/offers";

export async function declineOffer(offerId: string) {
  const { supabase } = await requireUser(`/offers/${offerId}`);

  if (!isUuid(offerId)) {
    return { error: "Invalid offer." };
  }

  const { error } = await supabase.rpc("decline_offer", { offer_id: offerId });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  revalidatePath(`/offers/${offerId}`);
  return { ok: true };
}
