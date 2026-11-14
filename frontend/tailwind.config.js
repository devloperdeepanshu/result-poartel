
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      colors: {
        brand: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },

        dark: {
          DEFAULT: "#090909",
          light: "#171717",
          softer: "#262626",
        },

        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          muted: "#f1f5f9",
        },
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        card: "0 8px 30px rgba(0, 0, 0, 0.06)",
        yellow: "0 4px 20px rgba(234, 179, 8, 0.18)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
