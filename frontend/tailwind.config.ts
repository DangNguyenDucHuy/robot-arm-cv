import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: {
          950: '#080b0f',
          900: '#0d1117',
          800: '#131920',
          700: '#1c242e',
          600: '#253040',
          500: '#344155',
          400: '#4e6070',
          300: '#7a90a4',
          200: '#a8bbc9',
          100: '#d4dfe8',
        },
        ember: {
          600: '#b33a00',
          500: '#e04d00',
          400: '#ff6b1a',
          300: '#ff8c4a',
          200: '#ffb380',
          100: '#ffd4b3',
        },
        jade: {
          500: '#00b87a',
          400: '#00d98e',
          300: '#33e8a6',
        },
        signal: {
          red: '#e53e3e',
          amber: '#d97706',
          blue: '#3b82f6',
        },
      },
      backgroundImage: {
        'grid-ink': `linear-gradient(rgba(255,107,26,0.04) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(255,107,26,0.04) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
      },
      animation: {
        'pulse-ember': 'pulseEmber 2s ease-in-out infinite',
        'scan-down': 'scanDown 3s linear infinite',
        'fade-up': 'fadeUp 0.4s ease-out both',
        'blink-cursor': 'blinkCursor 1.1s step-end infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseEmber: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(255,107,26,0)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 4px rgba(255,107,26,0.15)' },
        },
        scanDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blinkCursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'ember-sm': '0 0 8px rgba(255,107,26,0.25)',
        'ember-md': '0 0 20px rgba(255,107,26,0.2)',
        'jade-sm': '0 0 8px rgba(0,217,142,0.3)',
        'panel': '0 2px 16px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}

export default config
