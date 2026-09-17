import { SiteShell } from "@/components/site-shell";

const stages = [
  {
    index: "01",
    title: "Domain Synthesis",
    heading: "Specify the artifact",
    body: "Domain expertise is distilled into structured specifications. The customer brings the vision; we formalize the work.",
  },
  {
    index: "02",
    title: "Agentic Harness",
    heading: "Construct the system",
    body: "Autonomous construction, iterative generation, and test suites run inside a controlled execution harness.",
  },
  {
    index: "03",
    title: "Verification Council",
    heading: "Certify the record",
    body: "Security review, deterministic testing, and a certification dossier close the loop before release.",
  },
  {
    index: "04",
    title: "Hosting & Deployment",
    heading: "Operate and deploy",
    body: "We host and maintain your application continuously. Deploy iterations and new features directly from our platform at any time.",
  },
] as const;

const guarantees = [
  {
    index: "01",
    title: "Fully Managed Hosting",
    body: "We manage infrastructure, high-availability hosting, runtime environments, and performance monitoring.",
  },
  {
    index: "02",
    title: "Direct Deployment Access",
    body: "Deploy verified changes, feature updates, and improvements to your live application directly through our platform.",
  },
  {
    index: "03",
    title: "Continuous Maintenance",
    body: "Ongoing upkeep, security patching, and harness updates so your application remains production-ready and reliable.",
  },
  {
    index: "04",
    title: "Immutable audit trail",
    body: "Every build, verification report, and release milestone is permanently logged and visible in your dossier.",
  },
] as const;

export default function PricingPage() {
  return (
    <SiteShell current="pricing">
      <section className="mx-auto flex w-full max-w-frame flex-col items-center px-6 pt-20 pb-16 text-center md:px-12 md:pt-28 md:pb-20">
        <div className="inline-flex items-center border border-[#222222] bg-[#121212] px-4 py-1.5">
          <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#a3a3a3]">
            Directive 002 // Commercial Engagement
          </span>
        </div>

        <h1 className="mt-8 font-display text-4xl font-semibold uppercase tracking-[0.16em] text-white sm:text-5xl md:text-6xl">
          The Process
        </h1>
        <p className="mt-6 max-w-2xl font-body text-body leading-body tracking-body text-[#b3b3b3]">
          Our single, unified offering. A monthly retainer is set per
          engagement after the work is agreed. Payment is acceptance of that
          offer.
        </p>

        <div className="relative mt-16 w-full max-w-3xl border border-[#222222] bg-[#0f0f0f] text-left">
          <span className="absolute -top-[5px] -left-[5px] text-[10px] text-[#444444]">
            ┌
          </span>
          <span className="absolute -top-[5px] -right-[5px] text-[10px] text-[#444444]">
            ┐
          </span>
          <span className="absolute -bottom-[5px] -left-[5px] text-[10px] text-[#444444]">
            └
          </span>
          <span className="absolute -bottom-[5px] -right-[5px] text-[10px] text-[#444444]">
            ┘
          </span>

          <div className="flex items-center justify-between border-b border-[#222222] bg-[#141414] px-6 py-3.5">
            <div className="flex items-center gap-3">
              <span className="size-2 bg-white" />
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Engagement Record
              </span>
            </div>
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
              Record: CL-002
            </span>
          </div>

          <div className="p-6 md:p-10">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373]">
              Retainer
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-white">
              Set per engagement
            </h2>
            <p className="mt-4 font-body text-body leading-body text-[#b3b3b3]">
              Retainers are set per engagement. Sign in to review an offer
              that has been extended to your account.
            </p>

            <div className="mt-8 grid grid-cols-1 divide-y divide-[#1c1c1c] border border-[#222222] bg-[#111111] md:grid-cols-3 md:divide-x md:divide-y-0">
              <div className="p-4">
                <p className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
                  Delivery
                </p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                  Production System
                </p>
              </div>
              <div className="p-4">
                <p className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
                  Governance
                </p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                  Council Certified
                </p>
              </div>
              <div className="p-4">
                <p className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
                  Infrastructure
                </p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                  Managed & Hosted
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href="/account"
                className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-white px-8 font-label text-label font-semibold uppercase tracking-label-wide text-black transition-opacity duration-[160ms] hover:opacity-[0.88]"
              >
                Sign in to review an offer
              </a>
              <p className="text-center font-label text-[9px] uppercase tracking-[0.2em] text-[#666666]">
                If no offer is on file, contact Chiron Liber.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1c1c1c] bg-[#0c0c0c] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-frame">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#737373]">
              Architecture of Engagement
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl">
              What the process includes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => (
              <article
                key={stage.index}
                className="group flex min-h-[270px] flex-col justify-between border border-[#222222] bg-[#141414] p-8 transition-all duration-500 hover:border-[#666666] hover:bg-[#181818]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-[0.25em] text-[#737373] transition-colors duration-300 group-hover:text-white">
                    {stage.index}
                  </span>
                  <p className="max-w-[180px] text-right font-body text-body-sm leading-body tracking-body text-[#999999] transition-colors duration-300 group-hover:text-white">
                    {stage.body}
                  </p>
                </div>
                <div>
                  <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373] transition-colors duration-300 group-hover:text-[#a3a3a3]">
                    {stage.title}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold uppercase tracking-[0.14em] text-white">
                    {stage.heading}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1c1c1c] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-frame">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="font-label text-[9px] font-semibold uppercase tracking-[0.3em] text-[#737373]">
              Infrastructure & Operations
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl">
              Hosting & Deployment Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[#1c1c1c] border border-[#222222] md:grid-cols-2 md:divide-x xl:grid-cols-4 xl:divide-y-0">
            {guarantees.map((item) => (
              <article
                key={item.index}
                className="group bg-[#0f0f0f] p-8 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#737373] transition-colors duration-300 group-hover:text-white">
                  {item.index} // {item.title}
                </p>
                <p className="mt-4 font-body text-body leading-body tracking-body text-[#b3b3b3] transition-colors duration-300 group-hover:text-[#ededed]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
