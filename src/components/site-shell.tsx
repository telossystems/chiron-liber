import Image from "next/image";

import { SiteNav, type NavCurrent } from "@/components/site-nav";

type Props = {
  children: React.ReactNode;
  current?: NavCurrent;
  footerNote?: string;
};

export function SiteShell({
  children,
  current,
  footerNote = "Commercial Engagement",
}: Props) {
  return (
    <div className="flex min-h-full flex-col bg-[#0a0a0a] text-[#ededed] antialiased selection:bg-white selection:text-black">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <header className="relative z-10 border-b border-[#1c1c1c] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-frame items-center justify-between px-6 md:px-12">
          <a href="/" className="group flex items-center gap-3.5">
            <div className="relative flex size-9 items-center justify-center border border-[#262626] bg-[#111111] p-1 transition-colors duration-300 group-hover:border-[#555555]">
              <Image
                src="/cl-logo.jpg"
                alt="Chiron Liber monogram"
                width={36}
                height={36}
                priority
                className="size-full object-contain invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[15px] font-semibold uppercase tracking-[0.18em] text-white">
                Chiron Liber
              </span>
              <span className="font-label text-[8px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
                Atelier & Directive
              </span>
            </div>
          </a>
          <SiteNav current={current} />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">{children}</main>

      <footer className="relative z-10 border-t border-[#1c1c1c] bg-[#080808]">
        <div className="mx-auto flex max-w-frame flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div className="flex items-center gap-3.5">
            <div className="flex size-7 items-center justify-center border border-[#262626] bg-[#111111] p-1">
              <Image
                src="/cl-logo.jpg"
                alt=""
                width={28}
                height={28}
                className="size-full object-contain invert"
              />
            </div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Chiron Liber
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666666]">
              Verified
            </p>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666666]">
              Dossier 002
            </p>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666666]">
              {footerNote}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
