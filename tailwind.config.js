/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.05)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        flyUpAndScale: {
          "0%": { opacity: 0, transform: "translateY(30px) scale(0.5)" },
          "50%": { opacity: 1, transform: "translateY(-10px) scale(1.1)" },
          "100%": { opacity: 1, transform: "translateY(0px) scale(1)" },
        },
        floatBubble: {
          "0%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-15px) translateX(10px)" },
          "100%": { transform: "translateY(0px) translateX(0px)" },
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
        fadeInDown: "fadeInDown 0.8s ease-out forwards",
        fadeIn: "fadeIn 1s ease-out forwards",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        blob: "blob 7s infinite",
        flyUpAndScale: "flyUpAndScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        floatBubble: "floatBubble 5s ease-in-out infinite",
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