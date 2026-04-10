/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--landing-primary, #4F7CF3)",
          foreground: "var(--landing-primary-foreground, #ffffff)",
        },
        muted: {
          DEFAULT: "var(--landing-muted, #F5F7FB)",
          foreground: "var(--landing-muted-foreground, #6B7280)",
        },
        border: "var(--landing-border, #E8F0FF)",
        background: "var(--landing-background, #ffffff)",
        foreground: "var(--landing-foreground, #1F2937)",
        accent: {
          DEFAULT: "#2EC4B6",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
}