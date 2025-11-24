/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your components live elsewhere
    ],
    theme: {
      extend: {
        fontFamily: {
          // Adds a `font-inter` utility class that maps to the Inter font
          inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        },
      },
    },
    plugins: [
        require("daisyui"),
      ],
      daisyui: {
        themes: ["light", "dark", "cupcake"],
        darkTheme: "dark",
      },
      // 👈 Add DaisyUI as a plugin
  };
  