/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your components live elsewhere
    ],
    theme: {
      extend: {},
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
  