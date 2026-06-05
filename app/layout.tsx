import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { IconSearch, IconPlus } from "@/components/icons";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "De Videotheek",
  description: "Lokale catalogus van Nederlandse tv-series — DVD-boxen én downloads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${spaceGrotesk.variable} ${ibmPlex.variable}`}>
      <body className="font-sans">
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-edge bg-ink/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
              <Link
                href="/"
                className="font-heading text-[18px] font-bold tracking-[-0.01em] text-cream hover:text-amber"
              >
                De Videotheek
              </Link>

              {/* Globale zoekbalk */}
              <form action="/" method="get" className="relative ml-2 hidden flex-1 sm:block">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  name="zoek"
                  placeholder="Zoek een serie…"
                  className="input max-w-md pl-9"
                  aria-label="Zoek een serie"
                />
              </form>

              <nav className="ml-auto flex items-center gap-1 text-sm">
                <Link href="/" className="rounded px-3 py-2 text-muted transition hover:bg-panel2 hover:text-cream">
                  Series
                </Link>
                <Link href="/personen" className="rounded px-3 py-2 text-muted transition hover:bg-panel2 hover:text-cream">
                  Personen
                </Link>
                <Link href="/series/new" className="btn-primary ml-2">
                  <IconPlus /> Serie toevoegen
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

          <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted sm:px-6">
            De Videotheek — lokale verzameling. Vergeet je back-up van het SQLite-bestand niet (zie README).
          </footer>
        </div>
      </body>
    </html>
  );
}
