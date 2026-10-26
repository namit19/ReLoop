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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Vibrant modern emerald
          600: '#059669', // Rich emerald
          700: '#047857', // Deep emerald
          800: '#065f46', // Emerald forest
          900: '#064e3b', // Deep pine
          950: '#022c22', // Obsidian emerald
        },
        accent: {
          teal: '#0d9488',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
        surface: {
          bg: '#f8fafc',     // Crisp, pristine slate canvas (no muddy yellow/beige)
          card: '#ffffff',   // Pure crystal white card
          border: '#e2e8f0', // Crisp slate border
          subtle: '#f1f5f9', // Clean light slate surface
          muted: '#64748b',  // Slate muted text
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'soft': '0 4px 14px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 12px 28px -5px rgba(15, 23, 42, 0.08), 0 8px 12px -6px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 24px 45px -12px rgba(15, 23, 42, 0.12), 0 12px 18px -6px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-lg': '0 0 45px -5px rgba(13, 148, 136, 0.45)',
      }
    },
  },
  plugins: [],
}
