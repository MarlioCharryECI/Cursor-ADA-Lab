import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sage: {
          100: "#e4ece6",
          200: "#d2ddd4",
          400: "#8aa390",
          700: "#5b7c6a",
          800: "#4c6858",
        },
      },
    },
  },
  plugins: [],
};
export default config;
