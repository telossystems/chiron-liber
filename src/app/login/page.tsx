"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    setMessage("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("A sign-in link has been sent. Check your email.");
  }

  return (
    <SiteShell current="login" footerNote="Access">
      <section className="mx-auto flex w-full max-w-frame flex-col items-center px-6 pt-20 pb-24 text-center md:px-12">
        <div className="inline-flex items-center border border-[#222222] bg-[#121212] px-4 py-1.5">
          <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3a3a3]">
            Access // Magic Link
          </span>
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold uppercase tracking-[0.16em] text-white">
          Sign in
        </h1>
        <p className="mt-6 max-w-xl font-body text-body leading-body tracking-body text-[#b3b3b3]">
          Enter your email. We send a one-time link. No password is stored.
        </p>

        <form
          onSubmit={onSubmit}
          className="relative mt-12 w-full max-w-lg border border-[#222222] bg-[#0f0f0f] p-8 text-left"
        >
          <label className="block">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3]">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-body text-body text-white outline-none focus:border-white"
              placeholder="you@institution.com"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-pill bg-white font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity hover:opacity-[0.88] disabled:opacity-40"
          >
            {status === "sending" ? "Sending…" : "Send sign-in link"}
          </button>
          {message ? (
            <p
              className={`mt-4 font-body text-body-sm ${
                status === "error" ? "text-[#d4d4d4]" : "text-[#a3a3a3]"
              }`}
            >
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </SiteShell>
  );
}
