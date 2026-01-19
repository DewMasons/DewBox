/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        },
        colors: {
          // Web3 Color Palette
          'ice-blue': '#E8F4F8',
          'sky-blue': '#A8D8EA',
          'bright-cyan': '#00B4D8',
          'ocean-blue': '#0077B6',
          'deep-teal': '#006B7D',
          'dark-navy': '#023E4A',
          // Semantic colors
          web3: {
            50: '#E8F4F8',
            100: '#A8D8EA',
            200: '#00B4D8',
            300: '#0077B6',
            400: '#006B7D',
            500: '#023E4A',
          }
        },
        boxShadow: {
          'glass': '0 8px 32px rgba(0, 119, 182, 0.1)',
          'glass-lg': '0 12px 48px rgba(0, 119, 182, 0.15)',
          'glow': '0 4px 16px rgba(0, 180, 216, 0.3)',
          'glow-lg': '0 8px 32px rgba(0, 180, 216, 0.4)',
        },
        backdropBlur: {
          xs: '2px',
        },
        borderRadius: {
          '4xl': '2rem',
          '5xl': '2.5rem',
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
  };
  