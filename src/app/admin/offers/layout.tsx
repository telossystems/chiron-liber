import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers | Chiron Liber",
  description: "Issue a monthly retainer offer to a registered customer.",
};

export default function AdminOffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
