/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./containers/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    ".storybook/preview.tsx",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        textBlack:{
          DEFAULT: "var(--black-text-color)",
        foreground: "hsl(var(--secondary-foreground))",
        },
        borderOrColor: {
          DEFAULT: "var(--bg-button-active-color)",
          foreground: "hsl(var(--card-foreground))",
        },
        bgButtonFixed: {
          DEFAULT: "var(--bg-fixed-color)",
          foreground: "hsl(var(--card-foreground))",
        },
        bgWhiteColor: {
          DEFAULT: "var(--white-text-color)",
          foreground: "hsl(var(--card-foreground))",
        }
      },
      overlayPreview: {
        DEFAULT: "var(--bg-overlay-black-color)",
        foreground: "hsl(var(--secondary-foreground))",
      },
      overlayListToken: {
        DEFAULT: "var(--bg-overlay-color)",
        foreground: "hsl(var(--secondary-foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['SF Pro Display', 'sans-serif'],
      },
      letterSpacing: {
        "balance-separator": "-0.1rem",
      },
      boxShadow: {
        'popup': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        'content': '0px 2px 8px 0px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
