import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(
    /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`,
  ),
  title: "Pimolu Headset — The world on pause. Just you. And music.",
  description:
    "Discover Pimolu Headset. Essential design, made for your own moments. Explore the Champagne and Graphite finishes.",
  icons: { icon: "/pimolu-icon.svg" },
  openGraph: {
    title: "Pimolu Headset",
    description: "Your music. Your moment.",
    images: ["/images/preview.png"],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      {/* Browser extensions may inject attributes on body before hydration.
          Keep this escape hatch here so descendant mismatches remain visible. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
