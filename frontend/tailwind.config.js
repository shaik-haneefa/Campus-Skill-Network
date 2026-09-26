/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#050713',
          surface: '#080B18',
          card: '#0B1024',
          cardHover: '#0F172A',
          purpleBg: '#15102B',
          border: 'rgba(255, 255, 255, 0.10)',
          borderSubtle: 'rgba(148, 163, 184, 0.18)',
          glowBlue: '#1D4ED8',
          glowPurple: '#7C3AED',
          glowCyan: '#38BDF8',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa', // Light Blue
          500: '#3b82f6', // Bright Blue
          600: '#2563eb', // Primary Blue
          700: '#1d4ed8', // Dark Blue Glow
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#a78bfa', // Light Purple
          500: '#8b5cf6',
          600: '#7c3aed', // Purple
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // Cyan
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
