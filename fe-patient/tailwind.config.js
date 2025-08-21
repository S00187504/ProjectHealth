/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        card: 'var(--card)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
    },
  },
  plugins: [],
}
