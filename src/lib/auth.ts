import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser(next = "/account") {
  const { supabase, user } = await getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return { supabase, user };
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser("/admin/offers");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/account");
  }

  return { supabase, user };
}
