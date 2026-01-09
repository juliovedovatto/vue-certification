/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [{ pattern: /w-/ }, { pattern: /bg-/ }, { pattern: /-?scale-/ }],
  plugins: [require("@tailwindcss/typography")],
};
