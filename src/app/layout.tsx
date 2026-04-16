import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TraveLD — travel guides & itineraries",
  description:
    "City guides and trip ideas—plus optional member perks, previews, and upgrade paths in this sandbox app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[var(--travel-border)] bg-[var(--travel-surface)]/90 px-4 py-8 text-center text-xs text-[var(--travel-muted)]">
              <span className="text-[var(--travel-ink)]/90">TraveLD</span> · Sandbox app: fake
              checkout, browser-local accounts, no real charges.
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
