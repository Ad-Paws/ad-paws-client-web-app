import type { Config } from "tailwindcss";
import twAnimateCss from "tw-animate-css";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 🎯 Paleta semántica usada por shadcn */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        /* 🎨 Paleta “brand” con escala 50–900 que ya habíamos definido */
        brand: {
          50: "#eff6f5",
          100: "#d7ebe8",
          200: "#b0d6d0",
          300: "#88c2b8",
          400: "#61ad9f",
          500: "#39726b",
          600: "#2f5f59",
          700: "#264c47",
          800: "#1c3936",
          900: "#132625",
        },

        // “Brown / Cocoa” (derivada de tu café #3a2823 + fondos oscuros)
        brandSecondary: {
          50: "#f6f1ef",
          100: "#eadfd9",
          200: "#d3bcb1",
          300: "#bc9989",
          400: "#a57561",
          500: "#3a2823",
          600: "#2f201c",
          700: "#241816",
          800: "#191110",
          900: "#0f0a0a",
        },

        // Accent naranja (derivada de #E5A95D)
        brandAccent: {
          50: "#fdf6ec",
          100: "#fae8cd",
          200: "#f4d19d",
          300: "#eebb6d",
          400: "#e8b05f",
          500: "#e5a95d",
          600: "#c78f4a",
          700: "#a87538",
          800: "#8a5c28",
          900: "#5e3e1b",
        },

        // Azul info (derivada de #4D67A3)
        brandInfo: {
          50: "#f3f6fd",
          100: "#e3e9fb",
          200: "#c6d3f6",
          300: "#a8bef1",
          400: "#8ba8ec",
          500: "#4d67a3",
          600: "#3f5586",
          700: "#32436a",
          800: "#25314e",
          900: "#191f33",
        },

        // Alert / destructive (derivada de #C06C86)
        brandAlert: {
          50: "#fdf2f6",
          100: "#f9dde8",
          200: "#f3b9d1",
          300: "#ec94b9",
          400: "#e76e9f",
          500: "#c06c86",
          600: "#a25a71",
          700: "#84485c",
          800: "#653646",
          900: "#472432",
        },

        // Background helpers (para clases tipo bg-brandBg-soft, etc.)
        brandBg: {
          // light helpers (por si los ocupas en marketing/landing)
          soft: "#fff9ee", // off white
          // dark helpers (alineados a tu base)
          muted: "#263c3d", // background principal (dark)
          surface: "#2f4b4c", // card/popover
          sidebar: "#1f3233", // sidebar base
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [twAnimateCss()],
};

export default config;
