/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        canvas: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#21262d',
          muted: '#30363d',
        },
        accent: {
          cyan: '#58a6ff',
          green: '#3fb950',
          orange: '#f0883e',
          red: '#f85149',
          purple: '#a371f7',
        },
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};