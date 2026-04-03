/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'secondary-light': 'var(--secondary-light)',

        accent: 'var(--accent)',
        purple: 'var(--purple)',
        yellow: 'var(--yellow)',
        'light-yellow': 'var(--light-yellow)',

        text: 'var(--text-main)',
        muted: 'var(--text-sub)',

        background: 'var(--bg-main)',
        'background-soft': 'var(--bg-sub)',
      }
    }
  },
  plugins: [],
}
