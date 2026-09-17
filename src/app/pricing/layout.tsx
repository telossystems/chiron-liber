import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Process | Chiron Liber",
  description:
    "Commercial engagement for The Process. Retainers are set per engagement for domain synthesis, agentic construction, managed hosting, and live deployment access.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
