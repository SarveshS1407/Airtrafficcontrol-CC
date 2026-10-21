/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aviation: {
          navy: '#17324D',
          midnight: '#10263C',
          sky: '#5B9BD5',
          'sky-light': '#EBF3FA',
          'sky-subtle': '#F0F6FC',
          cloud: '#F5F8FB',
          slate: '#35465A',
          muted: '#708096',
          border: '#D1DCE5',
          green: '#258568',
          amber: '#D99A32',
          red: '#C94C4C',
        },
        atc: {
          950: '#10263C',
          900: '#17324D',
          850: '#1F3F5F',
          800: '#2A4E74',
          700: '#3D6591',
          600: '#5B9BD5',
          500: '#7EAFDE',
          accent: '#5B9BD5',
          radar: '#258568',
          warn: '#D99A32',
          danger: '#C94C4C',
          muted: '#708096',
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
