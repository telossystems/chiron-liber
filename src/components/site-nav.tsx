"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

const linkClass =
  "font-label text-label-sm font-semibold uppercase tracking-label-wide transition-colors";

export type NavCurrent =
  | "mission"
  | "pricing"
  | "account"
  | "login"
  | "admin"
  | "offers";

type Props = {
  current?: NavCurrent;
};

export function SiteNav({ current }: Props) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string | undefined) {
      if (!userId) {
        setIsAdmin(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();
      setIsAdmin(Boolean(profile?.is_admin));
    }

    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(Boolean(data.user));
      void loadProfile(data.user?.id);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
      void loadProfile(session?.user?.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="flex items-center gap-6">
      <a
        href="/#mission"
        className={`${linkClass} ${
          current === "mission"
            ? "text-white"
            : "text-[#737373] hover:text-white"
        }`}
      >
        Mission
      </a>
      <a
        href="/pricing"
        className={`${linkClass} ${
          current === "pricing"
            ? "text-white"
            : "text-[#737373] hover:text-white"
        }`}
      >
        Pricing
      </a>
      {isAdmin ? (
        <a
          href="/admin/offers"
          className={`${linkClass} ${
            current === "admin"
              ? "text-white"
              : "text-[#737373] hover:text-white"
          }`}
        >
          Admin
        </a>
      ) : null}
      {signedIn ? (
        <a
          href="/account"
          className={`${linkClass} ${
            current === "account" || current === "offers"
              ? "text-white"
              : "text-[#737373] hover:text-white"
          }`}
        >
          Account
        </a>
      ) : (
        <a
          href="/login"
          className={`${linkClass} ${
            current === "login"
              ? "text-white"
              : "text-[#737373] hover:text-white"
          }`}
        >
          Sign in
        </a>
      )}
    </nav>
  );
}
