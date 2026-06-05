import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Licht, warm-wit thema met helder blauw accent (zie DESIGN.md).
        // Tokennamen blijven gelijk; alleen hun waarden zijn omgedraaid.
        ink: "#FAF9F6",        // pagina-achtergrond (warm-wit)
        panel: "#FFFFFF",      // kaart / paneel
        panel2: "#F3F1EC",     // secundair paneel / hover / placeholder
        edge: "#E7E3DB",       // randen / scheidingslijnen
        cream: "#1F2329",      // hoofdtekst (donker antraciet)
        muted: "#6B7280",      // subtekst / metadata
        amber: "#2563EB",      // accent (blauw, ondanks de naam)
        amberdark: "#1D4ED8",  // accent hover/actief
        success: "#16A34A",
        danger: "#DC2626",
        dangerdark: "#B91C1C",
        "accent-soft": "#E8EFFE", // lichte accent-tint (chips, focus-vlak)
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      // Vrijwel scherpe hoeken; alles afgetopt op 6px (lg). 'full' blijft voor
      // ronde elementen. Hierdoor voldoen bestaande rounded-* utilities meteen.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "6px",
        xl: "6px",
        "2xl": "6px",
        "3xl": "6px",
        full: "9999px",
      },
      boxShadow: {
        hover: "0 4px 14px rgba(31,35,41,0.10)",
        pop: "0 8px 28px rgba(31,35,41,0.12)",
      },
      keyframes: {
        "poster-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "poster-in": "poster-in 150ms ease both",
        "pop-in": "pop-in 130ms ease both",
      },
    },
  },
  plugins: [],
};

export default config;
