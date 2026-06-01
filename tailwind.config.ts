import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warme, rustige "videotheek"-tinten
        ink: "#15110d",        // achtergrond
        panel: "#211a14",      // kaarten/panelen
        panel2: "#2c241c",     // hover/randen
        edge: "#3a2f24",       // randen
        cream: "#f3ead9",      // primaire tekst
        muted: "#b6a890",      // secundaire tekst
        amber: "#d9a441",      // accent
        amberdark: "#b9842b",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
