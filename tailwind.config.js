/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],

  plugins: [require("flowbite/plugin")],

  darkMode: "class",
  theme: {
    container: {
      center: true,
    },
    extend: {
      gridTemplateColumns: {
        fill: "repeat(auto-fill, minmax(208px, 1fr))",
      },
      colors: {
        primary: {
          50: "#eff3fe",
          100: "#e2eafd",
          200: "#cad8fb",
          300: "#a9bdf8",
          400: "#8799f2",
          500: "#6a77ea",
          600: "#4e51dd",
          700: "#4d4dc7",
          800: "#36389d",
          900: "#32357d",
          950: "#1d1d49",
        },
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
};
