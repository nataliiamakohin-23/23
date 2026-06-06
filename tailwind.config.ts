import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#F04E23',
        'accent-dark': '#d03d15',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulse_ring: {
          '0%':   { transform: 'scale(1)',    opacity: '0.7' },
          '100%': { transform: 'scale(1.6)',  opacity: '0' },
        },
      },
      animation: {
        pulse_ring: 'pulse_ring 1.2s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
