/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "!./node_modules/**"],
  theme: {
    extend: {
      gridTemplateRows: {
        14: "repeat(14, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
