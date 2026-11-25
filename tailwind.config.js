/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-soft': 'rgb(var(--surface-soft) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        plum: {
          50: '#fbf5f8',
          100: '#f4e5ed',
          200: '#e6c9d8',
          300: '#d3a3ba',
          400: '#b97595',
          500: '#9e5477',
          600: '#82405f',
          700: '#67324c',
          800: '#4f283d',
          900: '#3b1e2e',
          950: '#28111e',
        },
        teal: {
          50: '#edf9f6',
          100: '#d3efe8',
          200: '#a8ded4',
          300: '#74c5b8',
          400: '#43a797',
          500: '#2d8a7d',
          600: '#236e65',
          700: '#205952',
          800: '#1d4743',
          900: '#193b38',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 55px -30px rgba(56, 31, 46, 0.28)',
        card: '0 2px 3px rgba(56, 31, 46, 0.03), 0 14px 45px -30px rgba(56, 31, 46, 0.25)',
        float: '0 20px 50px -20px rgba(44, 24, 37, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp .65s ease-out both',
        'fade-in': 'fadeIn .45s ease-out both',
        'soft-pulse': 'softPulse 6s ease-in-out infinite',
        scan: 'scan 2.6s ease-in-out infinite',
        'hero-scan': 'heroScan 7s cubic-bezier(.4, 0, .2, 1) infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        'menu-in': 'menuIn .26s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        softPulse: {
          '0%, 100%': { opacity: '.6', transform: 'scale(.98)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '.2' },
          '50%': { transform: 'translateY(292px)', opacity: '.85' },
        },
        heroScan: {
          '0%': { transform: 'translateY(-140%)', opacity: '0' },
          '12%': { opacity: '.85' },
          '58%, 100%': { transform: 'translateY(640%)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '.72' },
          '50%': { opacity: '.95' },
        },
        menuIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
