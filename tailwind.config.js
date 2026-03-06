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

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'fy-blue-start': '#c1bbff', 
        'fy-pink-end': '#f4b8ec', 
        'fy-sidebar-active': '#d0e0ff',
        'fy-table-header': '#f1f5f9',
        'fy-btn-red': '#ef4444',
        'fy-btn-gray': '#94a3b8', 
      },
    },
  },
  plugins: [],
}