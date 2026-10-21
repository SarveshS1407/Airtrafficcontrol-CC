/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aviation: {
          ink: '#172D40',
          navy: '#20394D',
          cockpit: '#20394D',
          blueprint: '#456D8B',
          sky: '#8DB7D5',
          'sky-light': '#EBF3FA',
          'sky-subtle': '#F0F6FC',
          paper: '#F4F0E7',
          ivory: '#FCFAF5',
          grid: '#D6E0E7',
          orange: '#D87C43',
          'flight-orange': '#D87C43',
          green: '#467A67',
          'runway-green': '#467A67',
          steel: '#82909B',
          amber: '#C99B45',
          red: '#C94C4C',
          // Utility aliases for backward compatibility
          border: '#D6E0E7',
          slate: '#172D40',
          muted: '#82909B',
          cloud: '#F4F0E7',
        },
        atc: {
          950: '#172D40',
          900: '#20394D',
          850: '#2C4961',
          800: '#456D8B',
          700: '#5C82A0',
          600: '#8DB7D5',
          500: '#AFCDE4',
          accent: '#D87C43',
          radar: '#467A67',
          warn: '#C99B45',
          danger: '#C94C4C',
          muted: '#82909B',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
