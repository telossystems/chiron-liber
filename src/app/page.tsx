import Image from "next/image";

import { SiteNav } from "@/components/site-nav";

interface Chapter {
  num: string;
  tag: string;
  text: string;
}

const chapters: Chapter[] = [
  {
    num: "I",
    tag: "The Promethean Spark",
    text: "In Greek mythology, Prometheus stole fire from the gods and gave it to humanity—the gift that made craft, invention, and civilization possible. For this defiance, Zeus chained him to a mountain. Prometheus could be freed only if an immortal willingly surrendered immortality in his place. Chiron, the wise centaur, chose to make that sacrifice.",
  },
  {
    num: "II",
    tag: "The Liberator’s Covenant",
    text: "We chose the name “Chiron Liber”—Chiron the Liberator—because his story reflects our purpose. Technical knowledge is not something to guard as a moat. It is something to share so that others can create.",
  },
  {
    num: "III",
    tag: "The Agentic Harness",
    text: "Chiron Liber gives domain experts a direct way to tell our agentic development team what they need built. They bring the vision and real-world expertise; we turn it into robust, production-grade software they can actually run a business on.",
  },
  {
    num: "IV",
    tag: "The Utilitarian Commitment",
    text: "This is our utilitarian commitment: to place the power of software creation into capable hands, helping people solve meaningful problems and build things that benefit society.",
  },
];

const tenets = [
  {
    index: "01",
    title: "Authoritative",
    heading: "Consequential work",
    body: "Built for high-stakes enterprise governance. Every artifact is treated as a formal record, not a disposable draft.",
  },
  {
    index: "02",
    title: "Precise",
    heading: "Deliberate execution",
    body: "Controlled harnesses and verified steps. Each action appears measured, documented, and accountable.",
  },
  {
    index: "03",
    title: "Institutional",
    heading: "Certified quality",
    body: "Architectural restraint over ephemeral software trends. Verification is visible, and production is the standard.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-[#0a0a0a] text-[#ededed] antialiased selection:bg-white selection:text-black">
      {/* Background ambient architectural grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Header */}
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

          <div className="flex items-center gap-8">
            <SiteNav current="mission" />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        {/* Hero Section */}
        <section
          id="mission"
          className="relative mx-auto flex w-full max-w-frame flex-col items-center px-6 pt-20 pb-16 text-center md:px-12 md:pt-28 md:pb-24"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-3 border border-[#222222] bg-[#121212] px-4 py-1.5">
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3a3a3]">
            Your expertise built into software.
            </span>
          </div>

          {/* Master Title */}
          <h1 className="mt-8 flex flex-wrap items-center justify-center gap-4 font-display text-4xl font-semibold uppercase tracking-[0.16em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <div className="relative flex size-12 items-center justify-center border border-[#2a2a2a] bg-[#111111] p-1.5 md:size-16">
              <Image
                src="/cl-logo.jpg"
                alt=""
                width={64}
                height={64}
                className="size-full object-contain invert"
              />
            </div>
            <span>Chiron Liber</span>
          </h1>

          {/* Obsidian Chamber Manifesto Canvas */}
          <div className="relative mt-16 w-full max-w-4xl border border-[#222222] bg-[#0f0f0f] shadow-2xl">
            {/* Corner registration marks */}
            <span className="absolute -top-[5px] -left-[5px] text-[10px] text-[#444444]">┌</span>
            <span className="absolute -top-[5px] -right-[5px] text-[10px] text-[#444444]">┐</span>
            <span className="absolute -bottom-[5px] -left-[5px] text-[10px] text-[#444444]">└</span>
            <span className="absolute -bottom-[5px] -right-[5px] text-[10px] text-[#444444]">┘</span>

            {/* Top technical bar */}
            <div className="flex items-center justify-between border-b border-[#222222] bg-[#141414] px-6 py-3 text-left">
              <div className="flex items-center gap-3">
                <span className="size-2 bg-white" />
                <span className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                  Manifesto // The Liberator’s Compact
                </span>
              </div>
              <span className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
                Record: CL-001
              </span>
            </div>

            {/* Chapters Flow */}
            <div className="divide-y divide-[#1c1c1c] text-left">
              {chapters.map((chapter) => (
                <article
                  key={chapter.num}
                  className="group p-6 transition-colors duration-300 hover:bg-white/[0.03] md:p-10"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
                    <span className="font-display text-sm font-semibold tracking-wider text-[#666666] transition-colors duration-300 group-hover:text-white">
                      [{chapter.num}]
                    </span>
                    <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a3a3a3] transition-colors duration-300 group-hover:text-white">
                      {chapter.tag}
                    </p>
                  </div>
                  <p className="mt-4 font-body text-[15px] leading-[1.75] tracking-[0.015em] text-[#b3b3b3] transition-colors duration-300 group-hover:text-[#ededed] md:pl-10">
                    {chapter.text}
                  </p>
                </article>
              ))}
            </div>

            {/* Pull quote seal at the bottom of the card */}
            <div className="border-t border-[#222222] bg-[#121212] px-6 py-6 text-center md:px-12 md:py-8">
              <p className="font-display text-base font-semibold uppercase tracking-[0.12em] text-white md:text-lg">
                “Technical knowledge is not something to guard as a moat. It is something to share so that others can create.”
              </p>
            </div>
          </div>
        </section>

        {/* Tenets Section */}
        <section id="tenets" className="border-t border-[#1c1c1c] bg-[#0c0c0c] px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-frame">
            <div className="mb-12 flex flex-col items-center text-center">
              <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#737373]">
                Pillars of Execution
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl">
                Institutional Tenets
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {tenets.map((tenet) => (
                <article
                  key={tenet.index}
                  className="group relative flex min-h-[270px] flex-col justify-between border border-[#222222] bg-[#141414] p-8 text-white transition-all duration-500 hover:border-[#666666] hover:bg-[#181818]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-label text-[11px] font-semibold uppercase tracking-[0.25em] text-[#737373] transition-colors duration-300 group-hover:text-white">
                      {tenet.index}
                    </span>
                    <p className="max-w-[220px] text-right font-body text-body-sm leading-body tracking-body text-[#999999] transition-colors duration-300 group-hover:text-white">
                      {tenet.body}
                    </p>
                  </div>

                  <div className="mt-8 text-left">
                    <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373] transition-colors duration-300 group-hover:text-[#a3a3a3]">
                      {tenet.title}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-semibold uppercase tracking-[0.14em] text-white">
                      {tenet.heading}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
              Dossier 001
            </p>
            <p className="font-label text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666666]">
              Production Standard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
