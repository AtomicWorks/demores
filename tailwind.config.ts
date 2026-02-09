import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f10",
        surface: "#151517",
        soft: "#1c1c1f",
        accent: "#c9a16a",
        accentMuted: "#a7814b",
        textPrimary: "#f4eee6",
        textSecondary: "#b6ada1",
        line: "#2b2b2f"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 32px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(201,161,106,0.35), 0 16px 40px rgba(0,0,0,0.45)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
