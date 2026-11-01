import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B1B32",
        deepNavy: "#10243D",
        charcoal: "#111827",
        antiqueGold: "#C49A47",
        warmGold: "#D6AA59",
        warmIvory: "#F5F3EE",
        pureWhite: "#FFFFFF",
        steelGrey: "#64748B",
        deepEmerald: "#1E6B5A",
        mutedRed: "#B54747",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 27, 50, 0.05), 0 1px 2px -1px rgba(11, 27, 50, 0.05)",
        card: "0 4px 6px -1px rgba(11, 27, 50, 0.04), 0 2px 4px -2px rgba(11, 27, 50, 0.04)",
        elevated: "0 10px 15px -3px rgba(11, 27, 50, 0.06), 0 4px 6px -4px rgba(11, 27, 50, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
