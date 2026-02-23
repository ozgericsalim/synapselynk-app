/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00E5A0',
        'primary-dark': '#00C48C',
        dark: { 900: '#0a0f1c', 800: '#0f1629', 700: '#151d33', 600: '#1a2540' },
        card: '#111827',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
