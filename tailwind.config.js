/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ===============================
         ANIMACIONES
      =============================== */
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },

      animation: {
        float: "float 4s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
