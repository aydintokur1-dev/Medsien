import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Google's "latin" subset of Inter has no → (U+2192), so routes like "Istanbul → Berlin" fell back to Arial's long arrow.
// This 3 KB file is Inter's own arrow glyph; it's listed first in --font-sans and only covers U+2192.
const interArrow = localFont({
  src: "./fonts/inter-arrow.woff2",
  weight: "400 700",
  variable: "--font-inter-arrow",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2192" }],
});

export const metadata: Metadata = {
  title: "Operations overview · Istanbul Regional (case study prototype)",
  description:
    "Airport operations dashboard — UI/UX take-home case study prototype with fictional data. Not a real airport system.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${interArrow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
