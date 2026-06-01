import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "De Videotheek",
  description: "Lokale catalogus van Nederlandse tv-series — DVD-boxen én downloads.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-edge bg-ink/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <Link href="/" className="flex items-center gap-2 text-cream hover:text-amber">
                <span className="text-2xl">📼</span>
                <span className="text-lg font-semibold tracking-tight">De Videotheek</span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                <Link href="/" className="rounded-lg px-3 py-2 text-muted hover:bg-panel2 hover:text-cream">
                  Series
                </Link>
                <Link href="/personen" className="rounded-lg px-3 py-2 text-muted hover:bg-panel2 hover:text-cream">
                  Personen
                </Link>
                <Link href="/series/new" className="btn-primary ml-2">
                  + Nieuwe serie
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted/70">
            De Videotheek — lokale verzameling. Vergeet je back-up van het SQLite-bestand niet (zie README).
          </footer>
        </div>
      </body>
    </html>
  );
}
