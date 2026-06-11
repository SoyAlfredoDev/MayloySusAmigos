/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad — Turquesa / Cian vibrante
        milo: {
          50: "#e6f7f9",
          100: "#b3e8ef",
          200: "#80d9e5",
          300: "#4dcadb",
          400: "#26bdd1",
          500: "#15a1b3", // Primario principal
          600: "#0fa7bf", // Variante logo
          700: "#0c8494",
          800: "#096170",
          900: "#063e4c",
          950: "#032830",
        },
        // Acento — Rojo clínico (CTA, alertas)
        clinical: {
          50: "#fef2f3",
          100: "#fde0e3",
          200: "#fab8be",
          300: "#f59099",
          400: "#ef5f6c",
          500: "#e63946", // Acento principal
          600: "#c92d39",
          700: "#a8232e",
          800: "#871a24",
          900: "#66121a",
        },
        // Neutros — Tipografía y contornos cartoon/pop
        ink: {
          DEFAULT: "#1a1a2e",
          muted: "#4a4a68",
          light: "#7a7a96",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f8fafb",
          muted: "#eef2f4",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        milo: "1.25rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(21, 161, 179, 0.15)",
        "card-hover": "0 8px 30px -4px rgba(21, 161, 179, 0.25)",
        pop: "0 2px 0 0 #1a1a2e",
      },
      backgroundImage: {
        "paw-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2315a1b3' fill-opacity='0.04'%3E%3Ccircle cx='15' cy='15' r='4'/%3E%3Ccircle cx='25' cy='10' r='3'/%3E%3Ccircle cx='10' cy='25' r='3'/%3E%3Ccircle cx='20' cy='22' r='5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
