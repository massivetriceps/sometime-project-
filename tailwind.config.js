/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS 변수와 Tailwind 클래스명을 매핑
        primary: {
          DEFAULT: "var(--landing-primary, #030213)",
          foreground: "var(--landing-primary-foreground, #ffffff)",
        },
        muted: {
          DEFAULT: "var(--landing-muted, #f3f4f6)",
          foreground: "var(--landing-muted-foreground, #717182)",
        },
        border: "var(--landing-border, rgba(0, 0, 0, 0.1))",
        background: "var(--landing-background, #ffffff)",
        foreground: "var(--landing-foreground, #030213)",
      },
    },
  },
  plugins: [],
}