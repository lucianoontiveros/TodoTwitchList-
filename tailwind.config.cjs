/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // Hace que todas las clases de Tailwind tengan prioridad
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        transparente: "rgba(5, 1, 9, 0.500)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
