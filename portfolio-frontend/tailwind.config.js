/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const baseFonts = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./*html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        nicoMoji: ['"NicoMoji"', ...defaultTheme.fontFamily.sans],
        roboto: ['"roboto"', ...defaultTheme.fontFamily.sans]
      },
      dropShadow: {
        'a': '0 35px 35px rgba(255, 255, 255, 0.25)',
      }
    },
  },
  plugins: [],
}

