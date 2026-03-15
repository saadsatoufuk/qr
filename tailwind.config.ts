import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Customer menu - warm dark
        menu: {
          bg: '#0F0D0B',
          surface: '#1A1714',
          elevated: '#231F1B',
          text: '#F5F0EA',
          muted: '#9B9189',
          border: '#2E2924',
        },
        // Admin panel - cool dark
        admin: {
          bg: '#080808',
          surface: '#0F0F0F',
          card: '#141414',
          border: '#1E1E1E',
          sidebar: '#0A0A0A',
          row: '#111111',
          green: '#16A34A',
          gold: '#D4A853',
        },
        brand: 'var(--brand-color)',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-outfit)', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_ring: {
          '0%': { boxShadow: '0 0 0 0 var(--brand-color)' },
          '70%': { boxShadow: '0 0 0 8px transparent' },
          '100%': { boxShadow: '0 0 0 0 transparent' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'pulse-ring': 'pulse_ring 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
