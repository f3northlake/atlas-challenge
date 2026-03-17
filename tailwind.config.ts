import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // F3 brand colors
        f3yellow: "#F5C518",
        f3navy: "#1B2A4A",
        f3dark: "#111827",
      },
    },
  },
  plugins: [],
};

export default config;
